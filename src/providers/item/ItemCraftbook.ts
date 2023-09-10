import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { PROMISE_DEFAULT_CONCURRENCY } from "@providers/constants/ServerConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { blueprintManager } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUseWithCraftingRecipe, IUseWithCraftingRecipeItem } from "@providers/useWith/useWithTypes";
import { ICraftableItem, ICraftableItemIngredient, IItem, ItemSocketEvents } from "@rpg-engine/shared";
import { Promise } from "bluebird";
import { provide } from "inversify-binding-decorators";
import { ItemCraftingRecipes } from "./ItemCraftingRecipes";
import { AvailableBlueprints } from "./data/types/itemsBlueprintTypes";

@provide(ItemCraftbook)
export class ItemCraftbook {
  constructor(
    private inMemoryHashTable: InMemoryHashTable,
    private socketMessaging: SocketMessaging,
    private itemCraftingRecipes: ItemCraftingRecipes
  ) {}

  @TrackNewRelicTransaction()
  public async loadCraftableItems(itemSubType: string, character: ICharacter): Promise<void> {
    const cache = await this.inMemoryHashTable.get("load-craftable-items", character._id);

    const itemSubTypeCache = cache?.[itemSubType];

    if (itemSubTypeCache) {
      this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, itemSubTypeCache);
      return;
    }

    // Retrieve character inventory items
    const inventoryIngredients = await this.itemCraftingRecipes.getCharacterInventoryIngredients(character);

    const skills = (await Skill.findOne({ owner: character._id })
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;

    // Retrieve the list of recipes for the given item sub-type
    const recipes =
      itemSubType === "Suggested"
        ? await this.getRecipesWithAnyIngredientInInventory(character, inventoryIngredients)
        : await this.getRecipes(itemSubType);

    // Process each recipe to generate craftable items
    const craftableItemsPromises = recipes.map((recipe) => this.getCraftableItem(inventoryIngredients, recipe, skills));
    const craftableItems = ((await Promise.all(craftableItemsPromises)) as ICraftableItem[]).sort((a, b) => {
      // this what is craftable should be first
      if (a.canCraft && !b.canCraft) return -1;
      if (!a.canCraft && b.canCraft) return 1;
      return 0;
    });

    const currentCache = await this.inMemoryHashTable.get("load-craftable-items", character._id);

    await this.inMemoryHashTable.set("load-craftable-items", character._id, {
      ...currentCache,
      [itemSubType]: craftableItems,
    });

    // Send the list of craftable items to the user through a socket event
    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, craftableItems);
  }

  @TrackNewRelicTransaction()
  private async getRecipes(subType: string): Promise<IUseWithCraftingRecipe[]> {
    const hasCache: IUseWithCraftingRecipe[] = (await this.inMemoryHashTable.get(
      "crafting-recipes",
      subType
    )) as IUseWithCraftingRecipe[];

    if (hasCache) {
      return hasCache;
    }

    const recipes = this.itemCraftingRecipes.getAllRecipes();
    const itemKeys = await blueprintManager.getAllBlueprintKeys("items");

    // Use Bluebird's Promise.map for concurrent blueprint fetching
    const availableRecipes: IUseWithCraftingRecipe[] = await Promise.map(
      itemKeys,
      async (itemKey) => {
        const item = await blueprintManager.getBlueprint<IItem>("items", itemKey as AvailableBlueprints);
        if (item.subType === subType && recipes[item.key]) {
          return recipes[item.key];
        }
        return null;
      },
      { concurrency: PROMISE_DEFAULT_CONCURRENCY }
    );

    // Filter out null values and sort
    const result = availableRecipes
      .filter(Boolean)
      .sort((a, b) => a.minCraftingRequirements[1] - b.minCraftingRequirements[1]);

    await this.inMemoryHashTable.set("crafting-recipes", subType, result);

    return result;
  }

  @TrackNewRelicTransaction()
  private async getRecipesWithAnyIngredientInInventory(
    character: ICharacter,
    inventoryIngredients: Map<string, number>
  ): Promise<IUseWithCraftingRecipe[]> {
    const recipes = this.itemCraftingRecipes.getAllRecipes();

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

  @TrackNewRelicTransaction()
  private async getCraftableItem(
    inventoryInfo: Map<string, number>,
    recipe: IUseWithCraftingRecipe,
    skills: ISkill
  ): Promise<ICraftableItem> {
    const [item, ingredients] = await Promise.all([
      blueprintManager.getBlueprint<IItem>("items", recipe.outputKey as AvailableBlueprints),
      this.getCraftableItemIngredients(recipe.requiredItems),
    ]);

    const minCraftingRequirements = recipe.minCraftingRequirements;
    const haveMinimumSkills = this.itemCraftingRecipes.haveMinimumSkills(skills, recipe);
    const canCraft = this.itemCraftingRecipes.canCraftRecipe(inventoryInfo, recipe) && haveMinimumSkills;

    return {
      ...item,
      canCraft,
      ingredients: ingredients,
      minCraftingRequirements,
      levelIsOk: haveMinimumSkills,
    };
  }

  @TrackNewRelicTransaction()
  private async getCraftableItemIngredients(items: IUseWithCraftingRecipeItem[]): Promise<ICraftableItemIngredient[]> {
    const uniqueKey = this.generateUniqueHash(items);
    const cachedIngredients = (await this.inMemoryHashTable.get(
      "craftable-item-ingredients",
      uniqueKey
    )) as ICraftableItemIngredient[];

    if (cachedIngredients) {
      return cachedIngredients;
    }

    const ingredients = await Promise.map(
      items,
      async (item) => {
        const blueprint = await blueprintManager.getBlueprint<IItem>("items", item.key as AvailableBlueprints);
        return {
          key: item.key,
          qty: item.qty,
          name: blueprint ? blueprint.name : "",
          texturePath: blueprint ? blueprint.texturePath : "",
        };
      },
      { concurrency: PROMISE_DEFAULT_CONCURRENCY }
    );

    await this.inMemoryHashTable.set("craftable-item-ingredients", uniqueKey, ingredients);

    return ingredients;
  }

  private generateUniqueHash(items: IUseWithCraftingRecipeItem[]): string {
    return items.map((item) => `${item.key}-${item.qty}`).join(";");
  }
}
