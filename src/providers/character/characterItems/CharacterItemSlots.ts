import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { OperationStatus } from "@providers/types/ValidationTypes";

import { provide } from "inversify-binding-decorators";
import { ICharacterItemResult } from "./CharacterItems";

@provide(CharacterItemSlots)
export class CharacterItemSlots {
  public async getTotalQty(targetContainer: IItemContainer, itemKey: string): Promise<number> {
    const allItemsSameKey = this.getAllItemsFromKey(targetContainer, itemKey);

    let qty = 0;
    for (const item of allItemsSameKey) {
      if (item.stackQty) {
        qty += item.stackQty;
      } else {
        qty += 1;
      }
    }

    return qty;
  }

  public getAllItemsFromKey(targetContainer: IItemContainer, itemKey: string): IItem[] {
    const items: IItem[] = [];

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i] as unknown as IItem;

      if (!slotItem) continue;

      if (slotItem.key.replace(/-\d+$/, "").toString() === itemKey.replace(/-\d+$/, "").toString()) {
        items.push(slotItem);
      }
    }

    return items;
  }

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

  public async findItemSlotIndex(targetContainer: IItemContainer, itemId: string): Promise<number | undefined> {
    try {
      const container = (await ItemContainer.findById(targetContainer.id)) as unknown as IItemContainer;

      if (!container) {
        throw new Error("Container not found");
      }

      if (container) {
        for (let i = 0; i < container.slotQty; i++) {
          const slotItem = container.slots?.[i] as unknown as IItem;

          if (!slotItem) continue;

          if (slotItem?._id.toString() === itemId.toString()) {
            return i;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async findItemWithSameKey(targetContainer: IItemContainer, itemKey: string): Promise<IItem | undefined> {
    try {
      const container = (await ItemContainer.findById(targetContainer.id)) as unknown as IItemContainer;

      if (!container) {
        throw new Error("Container not found");
      }

      if (container) {
        for (let i = 0; i < container.slotQty; i++) {
          const slotItem = container.slots?.[i] as unknown as IItem;

          if (!slotItem) continue;

          // TODO: Find a better way to do this
          if (slotItem.key.replace(/-\d+$/, "") === itemKey.replace(/-\d+$/, "")) {
            return slotItem;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async findItemOnSlots(targetContainer: IItemContainer, itemId: string): Promise<IItem | undefined> {
    try {
      const container = (await ItemContainer.findById(targetContainer.id)) as unknown as IItemContainer;

      if (!container) {
        throw new Error("Container not found");
      }

      if (container) {
        for (let i = 0; i < container.slotQty; i++) {
          const slotItem = container.slots?.[i] as unknown as IItem;

          if (!slotItem) continue;

          if (slotItem._id.toString() === itemId.toString()) {
            return slotItem;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async deleteItemOnSlot(targetContainer: IItemContainer, itemId: string): Promise<boolean> {
    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i] as unknown as IItem;

      if (!slotItem) continue;
      if (slotItem._id.toString() === itemId.toString()) {
        // Changing item slot to undefined, thus removing it
        targetContainer.slots[i] = undefined;

        await ItemContainer.updateOne(
          {
            _id: targetContainer._id,
          },
          {
            $set: {
              slots: {
                ...targetContainer.slots,
              },
            },
          }
        );

        return true;
      }
    }
    return false;
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
    const hasAvailableSlot = await this.hasAvailableSlot(targetContainer._id, selectedItem);

    if (!hasAvailableSlot) {
      return {
        status: OperationStatus.Error,
        message: "Sorry, your inventory is full.",
      };
    }

    const firstAvailableSlotIndex = await this.getFirstAvailableSlotIndex(targetContainer, selectedItem);

    if (firstAvailableSlotIndex === null) {
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
