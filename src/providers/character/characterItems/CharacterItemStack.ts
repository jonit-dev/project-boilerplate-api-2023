import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

import { provide } from "inversify-binding-decorators";
import { CharacterItemSlots } from "./CharacterItemSlots";

@provide(CharacterItemStack)
export class CharacterItemStack {
  constructor(private socketMessaging: SocketMessaging, private characterItemSlots: CharacterItemSlots) {}

  // cases to cover:
  // 1: User already has stackable item on its container, and we didn't reach the max stack size. Add to stack.
  // 2: User already has stackable item on its container, and we reached the max stack size. Increase stack size to max, and create a new item with the difference.
  // 3: User doesn't have stackable item on its container. Create a new item.

  public async tryAddingItemToStack(
    character: ICharacter,
    targetContainer: IItemContainer,
    itemToBeAdded: IItem
  ): Promise<boolean | undefined> {
    try {
      // loop through all inventory container slots, checking to see if selectedItem can be stackable

      if (!targetContainer.slots) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, there are no slots in your container.");
      }

      const hasAvailableSlots = await this.characterItemSlots.hasAvailableSlot(targetContainer._id, itemToBeAdded);

      if (!hasAvailableSlots) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, there are no available slots in your container."
        );
        return false;
      }

      const allItemsSameKey = await this.characterItemSlots.getAllItemsFromKey(targetContainer, itemToBeAdded.key);

      if (!allItemsSameKey?.length) {
        return false; // create new item, if there are no items with the same key
      }

      const areAllItemsSameKeyStackFull = allItemsSameKey.every((item) => item.stackQty === itemToBeAdded.maxStackSize);

      if (areAllItemsSameKeyStackFull) {
        return false; // create new item, because there's nothing to stack!
      }

      for (let i = 0; i < targetContainer.slotQty; i++) {
        const slotItem = targetContainer.slots?.[i];

        if (!slotItem || slotItem.maxStackSize <= 1) continue; // if we dont have an item or its not stackable.

        const itemToBeAddedIsDuplicate = slotItem._id.toString() === itemToBeAdded._id.toString();

        if (itemToBeAddedIsDuplicate) {
          throw new Error("Item to be added is a duplicate of an existing item.");
        }

        const isSameItem = slotItem.key.replace(/-\d+$/, "") === itemToBeAdded.key.replace(/-\d+$/, "");

        if (!isSameItem) continue;

        if (slotItem.stackQty === slotItem.maxStackSize) continue; // if item is already full, skip

        if (slotItem.stackQty) {
          const futureStackQty = slotItem.stackQty + itemToBeAdded.stackQty;

          if (futureStackQty > itemToBeAdded.maxStackSize && slotItem.rarity === itemToBeAdded.rarity) {
            await this.addToStackAndCreateDifference(i, targetContainer, itemToBeAdded, futureStackQty);

            return false; // this means a new item should be created on itemContainer, with the difference quantity!
          }

          if (futureStackQty <= itemToBeAdded.maxStackSize && slotItem.rarity === itemToBeAdded.rarity) {
            // if updatedStackQty is less than or equal to maxStackSize, update stackQty of existing item. Do not create new one!
            await this.addToExistingStack(i, targetContainer, futureStackQty);

            // since the qty was added to an existing item, we don't need to create a new one.

            await Item.deleteOne({ _id: itemToBeAdded._id });

            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error(error);
    }
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
    try {
      // make sure we're not duplicating items
      const hasDuplicateItem = await this.characterItemSlots.findItemOnSlots(targetContainer, itemToBeAdded._id);

      if (hasDuplicateItem) {
        throw new Error("Item to be added is a duplicate of an existing item.");
      }

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
    } catch (error) {
      console.error(error);
    }
  }
}
