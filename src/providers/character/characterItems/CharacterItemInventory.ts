import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { OperationStatus } from "@providers/types/ValidationTypes";
import { IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ICharacterItemResult } from "./CharacterItems";

@provide(CharacterItemInventory)
export class CharacterItemInventory {
  public async deleteItemFromInventory(itemId: string, character: ICharacter): Promise<ICharacterItemResult> {
    const doesCharacterHaveItemInInventory = await this.checkItemInInventory(itemId, character);

    if (!doesCharacterHaveItemInInventory) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The character does not have the item to be deleted.",
      };
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The item to be deleted from the inventory was not found.",
      };
    }

    return await this.removeItemFromInventory(item._id, character);
  }

  public async checkItemInInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const inventory = (await character.inventory) as unknown as IItem;

    const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryItemContainer) {
      return false;
    }

    const inventoryItemIds = inventoryItemContainer?.itemIds;

    if (!inventoryItemIds) {
      return false;
    }

    return !!inventoryItemIds.find((id) => String(id) === String(itemId));
  }

  private async removeItemFromInventory(itemId: string, character: ICharacter): Promise<ICharacterItemResult> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    if (!item) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The item to be deleted was not found.",
      };
    }

    const inventory = (await character.inventory) as unknown as IItem;

    if (!inventory) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The character does not have an inventory.",
      };
    }

    const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryItemContainer) {
      return {
        status: OperationStatus.Error,
        message: "Oops! The character does not have an inventory.",
      };
    }

    for (let i = 0; i < inventoryItemContainer.slotQty; i++) {
      const slotItem = inventoryItemContainer.slots?.[i];

      if (!slotItem) continue;
      if (slotItem.key === item.key) {
        // Changing item slot to null, thus removing it
        inventoryItemContainer.slots[i] = null;

        await ItemContainer.updateOne(
          {
            _id: inventoryItemContainer._id,
          },
          {
            $set: {
              slots: {
                ...inventoryItemContainer.slots,
              },
            },
          }
        );

        return {
          status: OperationStatus.Success,
        };
      }
    }

    return {
      status: OperationStatus.Error,
      message: "Oops! Something went wrong while trying to remove the item from the inventory.",
    };
  }
}
