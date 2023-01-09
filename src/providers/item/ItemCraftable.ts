import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { recipeBlueprintsIndex } from "@providers/useWith/recipes/index";
import { IUseWithCraftingRecipe, IUseWithCraftingRecipeItem } from "@providers/useWith/useWithTypes";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import {
  ICraftableItem,
  ICraftableItemIngredient,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  IItemContainer,
  ItemSocketEvents,
} from "@rpg-engine/shared";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import random from "lodash/random";
import { CharacterWeight } from "@providers/character/CharacterWeight";

@provide(ItemCraftable)
export class ItemCraftable {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer,
    private characterValidation: CharacterValidation,
    private characterItemInventory: CharacterItemInventory,
    private characterWeight: CharacterWeight
  ) {}

  public async loadCraftableItems(itemSubType: string, character: ICharacter): Promise<void> {
    const inventoryInfo = await this.getCharacterInventoryItems(character);
    const recipes = this.getRecipes(itemSubType).map(this.getCraftableItem.bind(this, inventoryInfo));
    this.socketMessaging.sendEventToUser(character.channelId!, ItemSocketEvents.CraftableItems, recipes);
  }

  public async craftItem(itemKey: string, character: ICharacter): Promise<void> {
    if (!this.characterValidation.hasBasicValidation(character)) {
      return;
    }

    const blueprint = itemsBlueprintIndex[itemKey];
    const recipe = this.getAllRecipes()[itemKey];

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

    await this.performCrafting(recipe, character);
  }

  private async performCrafting(recipe: IUseWithCraftingRecipe, character: ICharacter): Promise<void> {
    for (const item of recipe.requiredItems) {
      const success = await this.characterItemInventory.decrementItemFromInventoryByKey(item.key, character, item.qty);
      if (!success) {
        return;
      }
    }

    await this.createItems(recipe, character);

    await this.characterWeight.updateCharacterWeight(character);
    await this.sendRefreshItemsEvent(character);
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

  private getCraftableItem(inventoryInfo: Map<string, number>, recipe: IUseWithCraftingRecipe): ICraftableItem {
    const item = itemsBlueprintIndex[recipe.outputKey];

    const ingredients: ICraftableItemIngredient[] = recipe.requiredItems.map(
      this.getCraftableItemIngredient.bind(this)
    );

    return {
      key: recipe.outputKey,
      name: item.name,
      canCraft: this.canCraftRecipe(inventoryInfo, recipe),
      texturePath: item.texturePath,
      ingredients: ingredients,
    };
  }

  private canCraftRecipe(inventoryInfo: Map<string, number>, recipe: IUseWithCraftingRecipe): boolean {
    return recipe.requiredItems.every((ing) => {
      const availableQty = inventoryInfo.get(ing.key) ?? 0;
      return availableQty >= ing.qty;
    });
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
    return availableRecipes;
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

  private async sendRefreshItemsEvent(character: ICharacter): Promise<void> {
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
  }
}
