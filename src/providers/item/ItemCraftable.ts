import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { blueprintManager } from "@providers/inversify/container";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { recipeBlueprintsIndex } from "@providers/useWith/recipes/index";
import { IUseWithCraftingRecipe, IUseWithCraftingRecipeItem } from "@providers/useWith/useWithTypes";
import Shared, {
  AnimationEffectKeys,
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
import { AvailableBlueprints } from "./data/types/itemsBlueprintTypes";

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
    private traitGetter: TraitGetter,
    private characterInventory: CharacterInventory
  ) {}

  public async loadCraftableItems(itemSubType: string, character: ICharacter): Promise<void> {
    // Retrieve character inventory items
    const inventoryInfo = await this.getCharacterInventoryItems(character);

    // Retrieve the list of recipes for the given item sub-type
    const recipes =
      itemSubType === "Suggested"
        ? await this.getRecipesWithAnyIngredientInInventory(character)
        : await this.getRecipes(itemSubType);

    // Process each recipe to generate craftable items
    const craftableItemsPromises = recipes.map((recipe) => this.getCraftableItem(inventoryInfo, recipe, character));
    const craftableItems = ((await Promise.all(craftableItemsPromises)) as ICraftableItem[]).sort((a, b) => {
      // this what is craftable should be first
      if (a.canCraft && !b.canCraft) return -1;
      if (!a.canCraft && b.canCraft) return 1;
      return 0;
    });

    // Send the list of craftable items to the user through a socket event
    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, craftableItems);
  }

  public async craftItem(itemToCraft: ICraftItemPayload, character: ICharacter): Promise<void> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return;
    }

    const blueprint = await blueprintManager.getBlueprint("items", itemToCraft.itemKey as AvailableBlueprints);
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
    if (!(await this.haveMinimumSkills(character, recipe))) {
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

      await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.SkillLevelUp);
    } else {
      const failureMessages = shuffle([
        "Sorry, you failed to craft the item.",
        "Hmm... you couldn't get it right.",
        "You almost got the item correctly, but failed.",
      ]);

      this.socketMessaging.sendErrorMessageToCharacter(character, failureMessages[0]);

      await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.Miss);
    }

    await this.characterWeight.updateCharacterWeight(character);
    await this.sendRefreshItemsEvent(character, itemSubType);
  }

  private async createItems(recipe: IUseWithCraftingRecipe, character: ICharacter): Promise<void> {
    const blueprint = await blueprintManager.getBlueprint<IItem>("items", recipe.outputKey as AvailableBlueprints);
    let qty = this.getQty(recipe);

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
    const item = await blueprintManager.getBlueprint<Shared.IItem>("items", recipe.outputKey as AvailableBlueprints);

    const ingredients: ICraftableItemIngredient[] = await Promise.all(
      recipe.requiredItems.map((item) => this.getCraftableItemIngredient(item))
    );

    const minCraftingRequirements = recipe.minCraftingRequirements;

    const haveMiniSkills = await this.haveMinimumSkills(character, recipe);

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

  private async haveMinimumSkills(character: ICharacter, recipe: IUseWithCraftingRecipe): Promise<boolean> {
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
        skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Blacksmithing);
        break;
      case CraftingSkill.Lumberjacking:
        skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Lumberjacking);
        break;
      case CraftingSkill.Alchemy:
        skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Alchemy);
        break;
      case CraftingSkill.Mining:
        skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Mining);
        break;
      case CraftingSkill.Cooking:
        skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Cooking);
        break;
      case CraftingSkill.Fishing:
        skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, CraftingSkill.Fishing);
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

  private async getCraftableItemIngredient(item: IUseWithCraftingRecipeItem): Promise<ICraftableItemIngredient> {
    const blueprint = await blueprintManager.getBlueprint<IItem>("items", item.key as AvailableBlueprints);

    return {
      key: item.key,
      qty: item.qty,
      name: blueprint ? blueprint.name : "",
      texturePath: blueprint ? blueprint.texturePath : "",
    };
  }

  private async getRecipes(subType: string): Promise<IUseWithCraftingRecipe[]> {
    const availableRecipes: IUseWithCraftingRecipe[] = [];
    const recipes = this.getAllRecipes();

    const itemKeys = await blueprintManager.getAllBlueprintKeys("items");

    for (const itemKey of itemKeys) {
      const item = await blueprintManager.getBlueprint<IItem>("items", itemKey as AvailableBlueprints);
      if (item.subType === subType && recipes[item.key]) {
        availableRecipes.push(recipes[item.key]);
      }
    }

    // Sorts the availableRecipes array based minCraftingRequirements level
    return availableRecipes.sort((a, b) => a.minCraftingRequirements[1] - b.minCraftingRequirements[1]);
  }

  private async getRecipesWithAnyIngredientInInventory(character: ICharacter): Promise<IUseWithCraftingRecipe[]> {
    const inventoryInfo = await this.getCharacterInventoryItems(character);

    const availableRecipes: IUseWithCraftingRecipe[] = [];
    const recipes = this.getAllRecipes();

    const itemKeys = await blueprintManager.getAllBlueprintKeys("items");

    for (const itemKey of itemKeys) {
      const item = await blueprintManager.getBlueprint<IItem>("items", itemKey as AvailableBlueprints);
      if (recipes[item.key]) {
        const recipe = recipes[item.key];
        if (recipe.requiredItems.some((ing) => inventoryInfo.get(ing.key) ?? ing.qty <= 0)) {
          availableRecipes.push(recipe);
        }
      }
    }

    return availableRecipes.sort((a, b) => {
      // sort by qty of ingredients in inventory first
      const aQty = a.requiredItems.reduce((acc, ing) => acc + (inventoryInfo.get(ing.key) ?? 0), 0);
      const bQty = b.requiredItems.reduce((acc, ing) => acc + (inventoryInfo.get(ing.key) ?? 0), 0);

      if (aQty > bQty) {
        return -1;
      }

      if (aQty < bQty) {
        return 1;
      }

      // sort by minCraftingRequirements level second
      return a.minCraftingRequirements[1] - b.minCraftingRequirements[1];
    });
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

  private getQty(recipe: IUseWithCraftingRecipe): number {
    const qty = random(recipe.outputQtyRange[0], recipe.outputQtyRange[1]);
    return qty;
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
