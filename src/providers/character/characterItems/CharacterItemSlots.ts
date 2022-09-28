import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { OperationStatus } from "@providers/types/ValidationTypes";

import { provide } from "inversify-binding-decorators";
import { ICharacterItemResult } from "./CharacterItems";

@provide(CharacterItemSlots)
export class CharacterItemSlots {
  public async updateItemOnSlot(
    slotIndex: number,
    targetContainer: IItemContainer,
    payload: Record<string, any>
  ): Promise<void> {
    const slotItem = targetContainer.slots[slotIndex];

    targetContainer.slots[slotIndex] = {
      ...slotItem,
      ...payload,
    };

    targetContainer.markModified("slots");
    await targetContainer.save();
  }

  public async hasAvailableSlot(targetContainerId: string, itemToBeAdded: IItem): Promise<boolean> {
    const targetContainer = (await ItemContainer.findById(targetContainerId)) as unknown as IItemContainer;

    if (!targetContainer) {
      return false;
    }

    if (!itemToBeAdded.isStackable) {
      return targetContainer.firstAvailableSlotId !== null;
    } else {
      // if item is stackable, check if there's an empty slot
      const hasEmptySlot = targetContainer.firstAvailableSlotId !== null;

      if (hasEmptySlot) {
        return true;
      }

      // if there's no empty slot, check if there's a stackable item with the same type, and the stack is not full

      // loop through all slots

      for (const slot of Object.values(targetContainer.slots)) {
        const slotItem = slot as unknown as IItem;

        if (slotItem.isStackable || slotItem.maxStackSize > 1) {
          if (slotItem.baseKey === itemToBeAdded.baseKey) {
            const futureStackQty = slotItem.stackQty! + itemToBeAdded.stackQty!;
            if (futureStackQty <= slotItem.maxStackSize) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  public async getFirstAvailableSlotIndex(
    targetContainer: IItemContainer,
    itemToBeAdded?: IItem
  ): Promise<number | null> {
    const itemContainer = (await ItemContainer.findById(targetContainer.id)) as unknown as IItemContainer;

    if (!itemContainer) {
      return null;
    }

    for (const [id, slot] of Object.entries(targetContainer.slots)) {
      const slotItem = slot as unknown as IItem;

      if (itemToBeAdded && slotItem && (slotItem.isStackable || slotItem.maxStackSize > 1)) {
        if (slotItem.baseKey === itemToBeAdded.baseKey) {
          const futureStackQty = slotItem.stackQty! + itemToBeAdded.stackQty!;
          if (futureStackQty <= slotItem.maxStackSize) {
            return Number(id);
          }
        }
      } else {
        if (!slotItem) {
          return Number(id);
        }
      }
    }

    return null;
  }

  public async addItemOnFirstAvailableSlot(
    selectedItem: IItem,
    targetContainer: IItemContainer
  ): Promise<ICharacterItemResult | undefined> {
    const firstAvailableSlotIndex = targetContainer.firstAvailableSlotId;

    const hasAvailableSlot = await this.hasAvailableSlot(targetContainer._id, selectedItem);

    if (!hasAvailableSlot || firstAvailableSlotIndex === null) {
      return {
        status: OperationStatus.Error,
        message: "Sorry, your inventory is full.",
      };
    }

    if (firstAvailableSlotIndex >= 0) {
      targetContainer.slots[firstAvailableSlotIndex] = selectedItem;

      await ItemContainer.updateOne(
        {
          _id: targetContainer.id,
        },
        {
          $set: {
            slots: targetContainer.slots,
          },
        }
      );

      return {
        status: OperationStatus.Success,
      };
    }
  }
}
