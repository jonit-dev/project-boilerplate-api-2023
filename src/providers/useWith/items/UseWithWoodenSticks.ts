import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { recipeBlueprintsIndex } from "../recipes/index";
import { IUseWithCraftingRecipe } from "../useWithTypes";

@provide(UseWithWoodenSticks)
export class UseWithWoodenSticks {
  constructor(
    private animationEffect: AnimationEffect,
    private characterItemInventory: CharacterItemInventory,
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async execute(targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> {
    const hasRequiredItems = await this.hasRequiredItemsOnInventory(targetItem, originItem, character);

    if (!hasRequiredItems) return;

    const availableRecipes = recipeBlueprintsIndex[originItem.key] || recipeBlueprintsIndex[targetItem.key];

    // get the recipe that matches the target and origin items keys and quantity

    let matchingRecipe: IUseWithCraftingRecipe | null = null;

    for (const recipe of availableRecipes) {
      const hasTargetItem = recipe.requiredItems.find(
        (requiredItem) => requiredItem.key === targetItem.key && (targetItem.stackQty || 1) >= requiredItem.qty
      );
      const hasOriginItem = recipe.requiredItems.find(
        (item) => item.key === originItem.key && (originItem.stackQty || 1) >= item.qty
      );

      if (hasTargetItem && hasOriginItem) {
        matchingRecipe = recipe;
        break;
      }
    }

    if (!matchingRecipe) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, the ingredients you have don't match any crafting recipe."
      );
      return;
    }

    const hasConsumedIngredients = await this.consumeRequiredItems(matchingRecipe, character);

    if (!hasConsumedIngredients) return;

    // now add the recipe output on the inventory
    const hasCreatedRecipeOutput = await this.createRecipeOutputOnInventory(matchingRecipe, character);

    if (!hasCreatedRecipeOutput) return;

    await this.refreshInventory(character);
  }

  private async createRecipeOutputOnInventory(
    matchingRecipe: IUseWithCraftingRecipe,
    character: ICharacter
  ): Promise<boolean> {
    const outputBlueprint = itemsBlueprintIndex[matchingRecipe.outputKey];
    const output = new Item({
      ...outputBlueprint,
      // random qty between min and max
      stackQty: random(matchingRecipe.outputQtyRange[0], matchingRecipe.outputQtyRange[1]),
    });
    await output.save();

    const inventory = await character.inventory;
    const inventoryContainerId = inventory.itemContainer as unknown as string;

    const addedItemToContainer = await this.characterItemContainer.addItemToContainer(
      output,
      character,
      inventoryContainerId
    );

    if (!addedItemToContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, failed to add crafting output to your inventory."
      );
      return false;
    }

    return true;
  }

  private async consumeRequiredItems(matchingRecipe: IUseWithCraftingRecipe, character: ICharacter): Promise<boolean> {
    // consume both items
    for (const requiredItem of matchingRecipe.requiredItems) {
      const hasDecrementedFromInventory = await this.characterItemInventory.decrementItemFromInventory(
        requiredItem.key,
        character,
        requiredItem.qty
      );

      if (!hasDecrementedFromInventory) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, something went wrong while trying to consume the required items."
        );

        return false;
      }
    }

    return true;
  }

  private async hasRequiredItemsOnInventory(
    targetItem: IItem,
    originItem: IItem,
    character: ICharacter
  ): Promise<boolean> {
    const hasTargetItem = await this.characterItemInventory.checkItemInInventoryByKey(targetItem.key, character);
    const hasOriginItem = await this.characterItemInventory.checkItemInInventoryByKey(originItem.key, character);

    if (!hasTargetItem || !hasOriginItem) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "You don't have the required items to perform this action."
      );
      return false;
    }

    return true;
  }

  private async refreshInventory(character: ICharacter): Promise<void> {
    const inventory = await character.inventory;
    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
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
