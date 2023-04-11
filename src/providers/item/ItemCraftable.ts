import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { recipeBlueprintsIndex } from "@providers/useWith/recipes/index";
import { IUseWithCraftingRecipe, IUseWithCraftingRecipeItem } from "@providers/useWith/useWithTypes";
import Shared, {
  CraftingSkill,
  ICraftItemPayload,
  ICraftableItem,
  ICraftableItemIngredient,
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  IUIShowMessage,
  ItemSocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import shuffle from "lodash/shuffle";

@provide(ItemCraftable)
export class ItemCraftable {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer,
    private characterValidation: CharacterValidation,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight,
    private animationEffect: AnimationEffect,
    private skillIncrease: SkillIncrease
  ) {}

  public async loadCraftableItems(itemSubType: string, character: ICharacter): Promise<void> {
    // Retrieve character inventory items
    const inventoryInfo = await this.getCharacterInventoryItems(character);

    // Retrieve the list of recipes for the given item sub-type
    const recipes = this.getRecipes(itemSubType);

    // Process each recipe to generate craftable items
    const craftableItemsPromises = recipes.map((recipe) => this.getCraftableItem(inventoryInfo, recipe, character));
    const craftableItems = (await Promise.all(craftableItemsPromises)) as ICraftableItem[];

    // Send the list of craftable items to the user through a socket event
    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, craftableItems);
  }

  public async craftItem(itemToCraft: ICraftItemPayload, character: ICharacter): Promise<void> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return;
    }

    const blueprint = itemsBlueprintIndex[itemToCraft.itemKey];
    const recipe = this.getAllRecipes()[itemToCraft.itemKey];

    if (!blueprint || !recipe) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this item can not be crafted.");
      return;
    }

    const inventoryInfo = await this.getCharacterInventoryItems(character);

    if (!this.canCraftRecipe(inventoryInfo, recipe)) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you do not have required items in your inventory."
      );
      return;
    }

    // Check if the character meets the minimum skill requirements for crafting
    if (!(await this.haveMiniSkills(character, recipe))) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you do not have the required skills ot craft this item."
      );
      return;
    }

    await this.performCrafting(recipe, character, itemToCraft.itemSubType);
  }

  /**
   * getCraftChance returns the chance for a successful craft based on a baseChance.
   * If the avg crafting skills are higher than the baseChance, then the isCraftSuccessful function
   * @param character
   * @param baseChance chance to use in case characters avg crafting skills < baseChance
   * @returns
   */
  public async getCraftChance(character: ICharacter, baseChance: number): Promise<() => Promise<boolean>> {
    const skillsAverage = await this.getCraftingSkillsAverage(character);
    return this.isCraftSuccessful.bind(null, skillsAverage - 1, baseChance);
  }

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
      const skillsAverage = await this.getCraftingSkillsAverage(character);
      proceed = this.isCraftSuccessful(skillsAverage - 1, 50);
    }

    if (proceed) {
      await this.createItems(recipe, character);
      // update crafting skills
      await this.skillIncrease.increaseCraftingSP(character, recipe.outputKey);

      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "You successfully crafted the item!",
        type: "info",
      });
    } else {
      const failureMessages = shuffle([
        "Sorry, you failed to craft the item.",
        "Hmm... you couldn't get it right.",
        "You almost got the item correctly, but failed.",
      ]);

      this.socketMessaging.sendErrorMessageToCharacter(character, failureMessages[0]);

      await this.animationEffect.sendAnimationEventToCharacter(character, "miss");
    }

    await this.characterWeight.updateCharacterWeight(character);
    await this.sendRefreshItemsEvent(character, itemSubType);
  }

  private async createItems(recipe: IUseWithCraftingRecipe, character: ICharacter): Promise<void> {
    const blueprint = itemsBlueprintIndex[recipe.outputKey];
    let qty = random(recipe.outputQtyRange[0], recipe.outputQtyRange[1]);

    do {
      const props: Partial<IItem> = {};

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

  private async getCraftableItem(
    inventoryInfo: Map<string, number>,
    recipe: IUseWithCraftingRecipe,
    character: ICharacter
  ): Promise<ICraftableItem> {
    const item = itemsBlueprintIndex[recipe.outputKey] as Shared.IItem;

    const ingredients: ICraftableItemIngredient[] = recipe.requiredItems.map(
      this.getCraftableItemIngredient.bind(this)
    );

    const minCraftingRequirements = recipe.minCraftingRequirements;

    const haveMiniSkills = await this.haveMiniSkills(character, recipe);

    const canCraft = this.canCraftRecipe(inventoryInfo, recipe) && haveMiniSkills;

    return {
      ...item,
      canCraft,
      ingredients: ingredients,
      minCraftingRequirements,
      levelIsOk: haveMiniSkills,
    };
  }

  private canCraftRecipe(inventoryInfo: Map<string, number>, recipe: IUseWithCraftingRecipe): boolean {
    return recipe.requiredItems.every((ing) => {
      const availableQty = inventoryInfo.get(ing.key) ?? 0;
      return availableQty >= ing.qty;
    });
  }

  private async haveMiniSkills(character: ICharacter, recipe: IUseWithCraftingRecipe): Promise<boolean> {
    // Retrieve the character with populated skills from the database
    const updatedCharacter = (await Character.findOne({ _id: character._id }).populate(
      "skills"
    )) as unknown as ICharacter;

    // Ensure the character has skills
    const skills = updatedCharacter.skills as unknown as ISkill;
    if (!skills) {
      return false;
    }

    // Retrieve the minimum crafting requirements from the recipe
    const minCraftingRequirements = recipe.minCraftingRequirements;

    // Determine the character's skill level for the required crafting skill
    let skillLevel: number = 0;
    switch (minCraftingRequirements[0]) {
      case CraftingSkill.Blacksmithing:
        skillLevel = skills.blacksmithing.level;
        break;
      case CraftingSkill.Lumberjacking:
        skillLevel = skills.lumberjacking.level;
        break;
      case CraftingSkill.Alchemy:
        skillLevel = skills.alchemy.level;
        break;
      case CraftingSkill.Mining:
        skillLevel = skills.mining.level;
        break;
      case CraftingSkill.Cooking:
        skillLevel = skills.cooking.level;
        break;
      case CraftingSkill.Fishing:
        skillLevel = skills.fishing.level;
        break;
      default:
        break;
    }

    // Check if the character's skill level meets the minimum crafting requirements
    if (skillLevel < minCraftingRequirements[1]) {
      return false;
    }

    // If all checks pass, return true
    return true;
  }

  private getCraftableItemIngredient(item: IUseWithCraftingRecipeItem): ICraftableItemIngredient {
    const blueprint = itemsBlueprintIndex[item.key];

    return {
      key: item.key,
      qty: item.qty,
      name: blueprint ? blueprint.name : "",
      texturePath: blueprint ? blueprint.texturePath : "",
    };
  }

  private getRecipes(subType: string): IUseWithCraftingRecipe[] {
    const availableRecipes: IUseWithCraftingRecipe[] = [];
    const recipes = this.getAllRecipes();
    for (const itemKey in itemsBlueprintIndex) {
      const item = itemsBlueprintIndex[itemKey];
      if (item.subType === subType && recipes[item.key]) {
        availableRecipes.push(recipes[item.key]);
      }
    }

    // Sorts the availableRecipes array based minCraftingRequirements level
    return availableRecipes.sort((a, b) => a.minCraftingRequirements[1] - b.minCraftingRequirements[1]);
  }

  private getAllRecipes(): Object {
    const obj = {};
    for (const itemKey in recipeBlueprintsIndex) {
      for (const recipe of recipeBlueprintsIndex[itemKey]) {
        obj[recipe.outputKey] = recipe;
      }
    }
    return obj;
  }

  private async getCharacterInventoryItems(character: ICharacter): Promise<Map<string, number>> {
    const map = new Map();

    const container = await this.characterItemContainer.getItemContainer(character);
    if (!container) {
      return map;
    }

    for (let i = 0; i < container.slotQty; i++) {
      const slotItem = container.slots[i];
      if (slotItem) {
        let qty = map.get(slotItem.key) ?? 0;
        if (slotItem.maxStackSize > 1) {
          qty += slotItem.stackQty;
        } else {
          qty++;
        }
        map.set(slotItem.key, qty);
      }
    }

    return map;
  }

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

    if (itemSubType) {
      await this.loadCraftableItems(itemSubType, character);
    }
  }

  private isCraftSuccessful(skillsAverage: number, baseChance: number): boolean {
    const bonusScale = 1 + (baseChance - 1) / 20; // scale bonus based on base chance
    const successChance = baseChance + Math.sqrt(skillsAverage * bonusScale) * 3;
    const roll = random(0, 100);
    return roll <= successChance;
  }

  private async getCraftingSkillsAverage(character: ICharacter): Promise<number> {
    const updatedCharacter = (await Character.findOne({ _id: character._id }).populate(
      "skills"
    )) as unknown as ICharacter;

    const skills = updatedCharacter.skills as unknown as ISkill;
    if (!skills) {
      return 0;
    }

    const craftingSkills: number[] = [
      skills.mining.level,
      skills.lumberjacking.level,
      skills.cooking.level,
      skills.alchemy.level,
      skills.blacksmithing.level,
    ];

    return Math.floor(craftingSkills.reduce((total, level) => total + level, 0) / craftingSkills.length);
  }
}
