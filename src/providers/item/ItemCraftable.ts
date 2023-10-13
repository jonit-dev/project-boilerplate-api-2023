import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { CharacterWeight } from "@providers/character/weight/CharacterWeight";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { blueprintManager } from "@providers/inversify/container";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import {
  AnimationEffectKeys,
  CraftingSkill,
  ICraftItemPayload,
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  IUIShowMessage,
  ItemRarities,
  ItemSocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { throttle } from "lodash";
import random from "lodash/random";
import shuffle from "lodash/shuffle";

import {
  CRAFTING_BASE_CHANCE_IMPACT,
  CRAFTING_DIFFICULTY_RATIO,
  CRAFTING_ITEMS_CHANCE,
} from "@providers/constants/CraftingConstants";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { AvailableBlueprints } from "./data/types/itemsBlueprintTypes";

import { ItemCraftbook } from "./ItemCraftbook";
import { ItemCraftingRecipes } from "./ItemCraftingRecipes";

@provide(ItemCraftable)
export class ItemCraftable {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer,
    private characterValidation: CharacterValidation,
    private characterItemInventory: CharacterItemInventory,
    private characterItemSlots: CharacterItemSlots,
    private characterWeight: CharacterWeight,
    private animationEffect: AnimationEffect,
    private skillIncrease: SkillIncrease,
    private characterInventory: CharacterInventory,
    private inMemoryHashTable: InMemoryHashTable,
    private traitGetter: TraitGetter,
    private itemCraftingRecipes: ItemCraftingRecipes,
    private itemCraftbook: ItemCraftbook
  ) {}

  @TrackNewRelicTransaction()
  public async craftItem(itemToCraft: ICraftItemPayload, character: ICharacter): Promise<void> {
    if (!character.skills) {
      return;
    }

    if (!itemToCraft.itemKey) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You must select at least one item to craft.");

      return;
    }

    if (!(character.skills as ISkill)?.level) {
      const skills = (await Skill.findOne({ owner: character._id })
        .lean()
        .cacheQuery({
          cacheKey: `${character._id}-skills`,
        })) as ISkill;
      character.skills = skills;
    }

    if (!this.characterValidation.hasBasicValidation(character)) {
      return;
    }

    const blueprint = await blueprintManager.getBlueprint("items", itemToCraft.itemKey as AvailableBlueprints);
    const recipe = this.itemCraftingRecipes.getAllRecipes()[itemToCraft.itemKey];

    if (!blueprint || !recipe) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this item can not be crafted.");
      return;
    }

    const inventoryInfo = await this.itemCraftingRecipes.getCharacterInventoryIngredients(character);

    if (!this.itemCraftingRecipes.canCraftRecipe(inventoryInfo, recipe)) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you do not have required items in your inventory."
      );
      return;
    }

    const inventory = await this.characterInventory.getInventory(character);

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the inventory is not available.");
      return;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the item container is not available.");
      return;
    }

    const qty = this.getQty(recipe);

    const itemToBeAdded = {
      ...blueprint,
      stackQty: qty,
    };

    // Check if the character meets the minimum skill requirements for crafting
    const hasMinimumSkills = await this.itemCraftingRecipes.haveMinimumSkills(character.skills as ISkill, recipe);

    if (!hasMinimumSkills) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you do not have the required skills ot craft this item."
      );
      return;
    }

    // Check if the character has available slots

    const hasAvailableSlots = await this.characterItemSlots.hasAvailableSlot(
      inventoryContainer._id,
      itemToBeAdded as IItem,
      true
    );

    if (!hasAvailableSlots) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, no more available slots.");
      return;
    }

    await this.inMemoryHashTable.delete("load-craftable-items", character._id);

    await this.performCrafting(recipe, character, itemToCraft.itemSubType);
  }

  /**
   * getCraftChance returns the chance for a successful craft based on a baseChance.
   * If the avg crafting skills are higher than the baseChance, then the isCraftSuccessful function
   * @param character
   * @param baseChance chance to use in case characters avg crafting skills < baseChance
   * @returns
   */
  @TrackNewRelicTransaction()
  public async getCraftChance(
    character: ICharacter,
    baseSkill: CraftingSkill,
    baseChance: number,
    rarityOfTool: string
  ): Promise<() => Promise<boolean>> {
    const skillLevel = await this.getSkillLevel(character, baseSkill);
    const rarityChance = this.getRarityPercent(rarityOfTool);

    return this.isCraftSuccessful.bind(null, skillLevel, baseChance + rarityChance ?? 0);
  }

  @TrackNewRelicTransaction()
  private async performCrafting(
    recipe: IUseWithCraftingRecipe,
    character: ICharacter,
    itemSubType?: string
  ): Promise<void> {
    let proceed = true;

    for (const item of recipe.requiredItems) {
      const success = await this.characterItemInventory.decrementItemFromInventoryByKey(item.key, character, item.qty);
      if (!success) {
        proceed = false;
        break;
      }
    }

    if (proceed) {
      const skillName = recipe.minCraftingRequirements[0];

      const skillLevel = await this.getSkillLevel(character, skillName as CraftingSkill);
      proceed = this.isCraftSuccessful(skillLevel, CRAFTING_ITEMS_CHANCE);
    }

    if (proceed) {
      await this.createItems(recipe, character);
      // update crafting skills
      await this.skillIncrease.increaseCraftingSP(character, recipe.outputKey, true);

      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "You successfully crafted the item!",
        type: "info",
      });

      await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.SkillLevelUp);
    } else {
      const failureMessages = shuffle([
        "Sorry, you failed to craft the item.",
        "Hmm... you couldn't get it right. At least you tried!",
        "You almost got the item correctly, but failed.",
        "You failed to craft the item. You should try again!",
      ]);

      // await this.skillIncrease.increaseCraftingSP(character, recipe.outputKey, false);

      this.socketMessaging.sendErrorMessageToCharacter(character, failureMessages[0]);

      await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.Miss);
    }

    await this.characterWeight.updateCharacterWeight(character);
    await this.sendRefreshItemsEvent(character, itemSubType);
  }

  @TrackNewRelicTransaction()
  private async sendRefreshItemsEvent(character: ICharacter, itemSubType?: string): Promise<void> {
    const inventoryContainer = await this.characterItemContainer.getItemContainer(character);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer as unknown as IItemContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );

    const throttledLoadCraftableItems = throttle(
      (itemSubType, character) => this.itemCraftbook.loadCraftableItems(itemSubType, character),
      1000
    );

    if (itemSubType) {
      void throttledLoadCraftableItems(itemSubType, character);
    }
  }

  @TrackNewRelicTransaction()
  private async createItems(recipe: IUseWithCraftingRecipe, character: ICharacter): Promise<void> {
    const blueprint = await blueprintManager.getBlueprint<IItem>("items", recipe.outputKey as AvailableBlueprints);
    let qty = this.getQty(recipe);

    do {
      const props: Partial<IItem> = {
        owner: character._id,
      };

      if (blueprint.maxStackSize > 1) {
        let stackQty = 0;

        if (blueprint.maxStackSize < qty) {
          qty = qty - blueprint.maxStackSize;
          stackQty = blueprint.maxStackSize;
        } else {
          stackQty = qty;
          qty = 0;
        }

        props.stackQty = stackQty;
      } else {
        qty--;
      }

      await this.characterItemInventory.addItemToInventory(recipe.outputKey, character, props);
    } while (qty > 0);
  }

  private getQty(recipe: IUseWithCraftingRecipe): number {
    const qty = random(recipe.outputQtyRange[0], recipe.outputQtyRange[1]);
    return qty;
  }

  /*
    Higher CRAFTING_DIFFICULTY_RATIO: Less impact of skillsAverage on successChance, making crafting more difficult.
    Lower CRAFTING_DIFFICULTY_RATIO: Greater impact of skillsAverage on successChance, making crafting easier.
  */

  private isCraftSuccessful(skillLevel: number, baseChance: number): boolean {
    baseChance = baseChance * CRAFTING_BASE_CHANCE_IMPACT;

    // Quadratic formula for impact
    const quadraticImpact = Math.pow(skillLevel, 0.7) / CRAFTING_DIFFICULTY_RATIO;

    const adjustedBaseChance = baseChance + quadraticImpact;

    // Cap successChance at 100
    const successChance = Math.min(100, adjustedBaseChance);

    const roll = random(0, 100);

    return roll <= successChance;
  }

  private async getSkillLevel(character: ICharacter, skillName: CraftingSkill): Promise<number> {
    const skills = (await Skill.findOne({ owner: character._id })
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;

    if (!skills) {
      return 0;
    }

    const skillLevel = (await this.traitGetter.getSkillLevelWithBuffs(skills, skillName)) ?? skills[skillName].level;

    return skillLevel;
  }

  private getRarityPercent(itemRarity: string): number {
    switch (itemRarity) {
      case ItemRarities.Common: {
        return 0;
      }
      case ItemRarities.Uncommon: {
        return 5;
      }

      case ItemRarities.Rare: {
        return 1;
      }
      case ItemRarities.Epic: {
        return 15;
      }
      case ItemRarities.Legendary: {
        return 25;
      }
      default: {
        return 0;
      }
    }
  }
}
