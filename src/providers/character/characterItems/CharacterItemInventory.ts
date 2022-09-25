import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterItemInventory)
export class CharacterItemInventory {
  public async deleteItemFromInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const doesCharacterHaveItemInInventory = await this.checkItemInInventory(itemId, character);

    if (!doesCharacterHaveItemInInventory) {
      return false;
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return false;
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

  private async removeItemFromInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    if (!item) {
      return false;
    }

    const inventory = (await character.inventory) as unknown as IItem;

    if (!inventory) {
      return false;
    }

    const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryItemContainer) {
      return false;
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

        return true;
      }
    }

    return false;
  }
}
