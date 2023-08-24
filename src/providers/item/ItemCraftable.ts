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
  ItemRarities,
  ItemSocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { throttle } from "lodash";
import random from "lodash/random";
import shuffle from "lodash/shuffle";

import { CRAFTING_DIFFICULTY_RATIO } from "@providers/constants/CraftingConstants";
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
    private characterInventory: CharacterInventory,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
  public async loadCraftableItems(itemSubType: string, character: ICharacter): Promise<void> {
    const namespace = this.getNamespaceLoadCraftItems(itemSubType, character._id);

    const cachedItems = await this.getCachedCraftableItems(namespace, itemSubType);
    if (cachedItems) {
      this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, cachedItems);

      return;
    }

    const craftableItems = await this.generateCraftableItems(character, itemSubType);

    await this.setCraftableItemsToCache(namespace, itemSubType, craftableItems);

    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, craftableItems);
  }

  private async generateCraftableItems(character: ICharacter, itemSubType: string): Promise<ICraftableItem[]> {
    // Retrieve character inventory items
    const inventoryIngredients = await this.getCharacterInventoryIngredients(character);

    // Retrieve character's skills
    const skills = (await Skill.findOne({ owner: character._id })
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;

    // Determine which method to use for retrieving recipes based on the itemSubType
    const recipes =
      itemSubType === "Suggested"
        ? await this.getRecipesWithAnyIngredientInInventory(character, inventoryIngredients)
        : await this.getRecipes(itemSubType);

    // Map recipes to craftable items
    const craftableItemsResults = await Promise.all(
      recipes.map((recipe: IUseWithCraftingRecipe) => this.getCraftableItem(inventoryIngredients, recipe, skills))
    );

    // Sort craftable items based on whether they can be crafted or not
    return craftableItemsResults.sort((a, b) => {
      if (a.canCraft && !b.canCraft) return -1;
      if (!a.canCraft && b.canCraft) return 1;
      return 0;
    });
  }

  private getNamespaceLoadCraftItems(itemSubType: string, characterId: string): string {
    const namespace = itemSubType === "Suggested" ? "load-craftable-items-sugested" : "load-craftable-items";
    return `${namespace}:${characterId}`;
  }

  private async getCachedCraftableItems(namespace: string, itemSubType: string): Promise<ICraftableItem[] | null> {
    const hasCache = await this.inMemoryHashTable.has(namespace, itemSubType);

    if (!hasCache) {
      return null;
    }

    return (await this.inMemoryHashTable.get(namespace, itemSubType)) as ICraftableItem[];
  }

  private async setCraftableItemsToCache(
    namespace: string,
    itemSubType: string,
    craftableItems: ICraftableItem[]
  ): Promise<void> {
    await this.inMemoryHashTable.set(namespace, itemSubType, craftableItems);
    if (itemSubType === "Suggested") {
      await this.inMemoryHashTable.expire(namespace, 120, "NX");
    }
  }

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
    const recipe = this.getAllRecipes()[itemToCraft.itemKey];

    if (!blueprint || !recipe) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this item can not be crafted.");
      return;
    }

    const inventoryInfo = await this.getCharacterInventoryIngredients(character);

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
    const hasMinimumSkills = await this.haveMinimumSkills(character.skills as ISkill, recipe);

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

    await this.inMemoryHashTable.deleteAll(`load-craftable-items:${character._id}`);
    await this.inMemoryHashTable.deleteAll(`load-craftable-items-sugested:${character._id}`);

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
    baseChance: number,
    rarityOfTool: string
  ): Promise<() => Promise<boolean>> {
    const skillsAverage = await this.getCraftingSkillsAverage(character);
    const rarityChance = this.getRarityPercent(rarityOfTool);

    return this.isCraftSuccessful.bind(null, skillsAverage - 1, baseChance + rarityChance ?? 0);
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
      (itemSubType, character) => this.loadCraftableItems(itemSubType, character),
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

  @TrackNewRelicTransaction()
  private async getCraftableItem(
    inventoryInfo: Map<string, number>,
    recipe: IUseWithCraftingRecipe,
    skills: ISkill
  ): Promise<ICraftableItem> {
    const item = await blueprintManager.getBlueprint<Shared.IItem>("items", recipe.outputKey as AvailableBlueprints);

    const ingredients: ICraftableItemIngredient[] = await Promise.all(
      recipe.requiredItems.map((item) => this.getCraftableItemIngredient(item))
    );

    const minCraftingRequirements = recipe.minCraftingRequirements;

    const haveMinimumSkills = await this.haveMinimumSkills(skills, recipe);

    const canCraft = this.canCraftRecipe(inventoryInfo, recipe) && haveMinimumSkills;

    return {
      ...item,
      canCraft,
      ingredients: ingredients,
      minCraftingRequirements,
      levelIsOk: haveMinimumSkills,
    };
  }

  private canCraftRecipe(inventoryInfo: Map<string, number>, recipe: IUseWithCraftingRecipe): boolean {
    return recipe.requiredItems.every((ing) => {
      const availableQty = inventoryInfo.get(ing.key) ?? 0;

      return availableQty >= ing.qty;
    });
  }

  @TrackNewRelicTransaction()
  private haveMinimumSkills(skills: ISkill, recipe: IUseWithCraftingRecipe): boolean {
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

  @TrackNewRelicTransaction()
  private async getCraftableItemIngredient(item: IUseWithCraftingRecipeItem): Promise<ICraftableItemIngredient> {
    const blueprint = await blueprintManager.getBlueprint<IItem>("items", item.key as AvailableBlueprints);

    return {
      key: item.key,
      qty: item.qty,
      name: blueprint ? blueprint.name : "",
      texturePath: blueprint ? blueprint.texturePath : "",
    };
  }

  @TrackNewRelicTransaction()
  private async getRecipes(subType: string): Promise<IUseWithCraftingRecipe[]> {
    const hasCache = (await this.inMemoryHashTable.get("crafting-recipes", subType)) as IUseWithCraftingRecipe[];

    if (hasCache) {
      return hasCache;
    }

    const availableRecipes: IUseWithCraftingRecipe[] = [];
    const recipes = this.getAllRecipes();

    const items = (await blueprintManager.getAllBlueprintValues("items")) as IItem[];

    for (const item of items) {
      if (!recipes[item.key]) continue;

      if (item.subType === subType) {
        availableRecipes.push(recipes[item.key]);
      }
    }

    const result = availableRecipes.sort((a, b) => a.minCraftingRequirements[1] - b.minCraftingRequirements[1]);

    await this.inMemoryHashTable.set("crafting-recipes", subType, result);

    // Sorts the availableRecipes array based minCraftingRequirements level
    return result;
  }

  @TrackNewRelicTransaction()
  private async getCharacterInventoryIngredients(character: ICharacter): Promise<Map<string, number>> {
    const items = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

    if (!items) {
      return new Map<string, number>();
    }

    const ingredientMap = new Map<string, number>();

    for (const item of items) {
      if (item.stackQty) {
        ingredientMap.set(item.key, item.stackQty + (ingredientMap.get(item.key) ?? 0));
      } else {
        ingredientMap.set(item.key, (ingredientMap.get(item.key) ?? 0) + 1);
      }
    }

    return ingredientMap;
  }

  @TrackNewRelicTransaction()
  private async getRecipesWithAnyIngredientInInventory(
    character: ICharacter,
    inventoryIngredients: Map<string, number>
  ): Promise<IUseWithCraftingRecipe[]> {
    const recipes = this.getAllRecipes();

    // First, get all item keys
    const itemKeys = await blueprintManager.getAllBlueprintKeys("items");

    // Then, get all items in parallel
    const items = await Promise.all(
      itemKeys.map((itemKey) => blueprintManager.getBlueprint<IItem>("items", itemKey as AvailableBlueprints))
    );

    // Filter out only the items that are also recipes and have any required items in the inventory
    const availableRecipes = items.reduce((acc, item) => {
      const recipe = recipes[item.key];
      if (recipe && recipe.requiredItems.some((ing) => (inventoryIngredients.get(ing.key) ?? 0) > 0)) {
        acc.push(recipe);
      }
      return acc;
    }, [] as IUseWithCraftingRecipe[]);

    // Pre-calculate the quantities of ingredients and store them for sorting
    const quantities = availableRecipes.map((recipe) =>
      recipe.requiredItems.reduce((acc, ing) => acc + (inventoryIngredients.get(ing.key) ?? 0), 0)
    );

    // Finally, sort the available recipes
    return availableRecipes.sort((a, b) => {
      const aQty = quantities[availableRecipes.indexOf(a)];
      const bQty = quantities[availableRecipes.indexOf(b)];

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

  private getQty(recipe: IUseWithCraftingRecipe): number {
    const qty = random(recipe.outputQtyRange[0], recipe.outputQtyRange[1]);
    return qty;
  }

  private isCraftSuccessful(skillsAverage: number, baseChance: number): boolean {
    const bonusScale = 1 + (baseChance - 1) / 40;
    const successChance = baseChance + skillsAverage * bonusScale * CRAFTING_DIFFICULTY_RATIO;
    const roll = random(0, 100);
    return roll <= successChance;
  }

  private async getCraftingSkillsAverage(character: ICharacter): Promise<number> {
    const skills = (await Skill.findOne({ owner: character._id })
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;

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
