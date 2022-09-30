import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { OperationStatus } from "@providers/types/ValidationTypes";

import { provide } from "inversify-binding-decorators";
import { ICharacterItemResult } from "./CharacterItems";
import { CharacterItemSlots } from "./CharacterItemSlots";

@provide(CharacterItemStack)
export class CharacterItemStack {
  constructor(private characterItemSlots: CharacterItemSlots) {}

  // cases to cover:
  // 1: User already has stackable item on its container, and we didn't reach the max stack size. Add to stack.
  // 2: User already has stackable item on its container, and we reached the max stack size. Increase stack size to max, and create a new item with the difference.
  // 3: User doesn't have stackable item on its container. Create a new item.

  public async tryAddingItemToStack(
    targetContainer: IItemContainer,
    itemToBeAdded: IItem
  ): Promise<ICharacterItemResult | null> {
    // loop through all inventory container slots, checking to see if selectedItem can be stackable

    if (!targetContainer.slots) {
      return {
        status: OperationStatus.Error,
        message: "Sorry, there are no slots in your container.",
      };
    }

    const hasAvailableSlots = await this.characterItemSlots.hasAvailableSlot(targetContainer._id, itemToBeAdded);

    if (!hasAvailableSlots) {
      return {
        status: OperationStatus.Error,
        message: "Sorry, there are no available slots in your container.",
      };
    }

    const allItemsSameKey = await this.characterItemSlots.getAllItemsFromKey(targetContainer, itemToBeAdded.key);

    if (!allItemsSameKey?.length) {
      return null; // create new item, if there are no items with the same key
    }

    const areAllItemsSameKeyStackFull = allItemsSameKey.every((item) => item.stackQty === itemToBeAdded.maxStackSize);

    if (areAllItemsSameKeyStackFull) {
      return null; // create new item, because there's nothing to stack!
    }

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i];

      if (!slotItem || slotItem.maxStackSize <= 1) continue; // if we dont have an item or its not stackable.

      const isSameItem = slotItem.key.replace(/-\d+$/, "") === itemToBeAdded.key.replace(/-\d+$/, "");

      if (!isSameItem) continue;

      if (slotItem.stackQty === slotItem.maxStackSize) continue; // if item is already full, skip

      if (slotItem.stackQty) {
        const futureStackQty = slotItem.stackQty + itemToBeAdded.stackQty;

        if (futureStackQty > itemToBeAdded.maxStackSize) {
          await this.addToStackAndCreateDifference(i, targetContainer, itemToBeAdded, futureStackQty);

          return null; // this means a new item should be created on itemContainer, with the difference quantity!
        }

        if (futureStackQty <= itemToBeAdded.maxStackSize) {
          // if updatedStackQty is less than or equal to maxStackSize, update stackQty of existing item. Do not create new one!
          await this.addToExistingStack(i, targetContainer, futureStackQty);

          // delete selectedItem to cleanup database (now hes on the container)
          await Item.deleteOne({ _id: itemToBeAdded._id });
        }

        return {
          status: OperationStatus.Success,
        };
      }
    }
    return null;
  }

  private async addToExistingStack(
    slotIndex: number,
    targetContainer: IItemContainer,
    futureStackQty: number
  ): Promise<void> {
    await this.characterItemSlots.updateItemOnSlot(slotIndex, targetContainer, {
      stackQty: futureStackQty,
    });
  }

  private async addToStackAndCreateDifference(
    slotIndex: number,
    targetContainer: IItemContainer,
    itemToBeAdded: IItem,
    futureStackQty: number
  ): Promise<void> {
    // existing item will have maxStack size
    await this.characterItemSlots.updateItemOnSlot(slotIndex, targetContainer, {
      stackQty: itemToBeAdded.maxStackSize,
    });

    const difference = futureStackQty - itemToBeAdded.maxStackSize;

    // create a new item with the difference
    itemToBeAdded.stackQty = difference;
    await itemToBeAdded.save();

    await Item.updateOne(
      {
        _id: itemToBeAdded._id,
      },
      { $set: { stackQty: difference } }
    );
  }
}
