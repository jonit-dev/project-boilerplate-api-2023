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

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i];

      if (!slotItem) continue;

      if (slotItem.key === itemToBeAdded.key.replace(/-\d+$/, "")) {
        if (slotItem.stackQty) {
          const updatedStackQty = slotItem.stackQty + itemToBeAdded.stackQty;

          if (updatedStackQty > itemToBeAdded.maxStackSize) {
            await this.characterItemSlots.updateItemOnSlot(i, targetContainer, {
              stackQty: itemToBeAdded.maxStackSize,
            });

            itemToBeAdded.stackQty = updatedStackQty - itemToBeAdded.maxStackSize;
            await itemToBeAdded.save();

            return null; // this means a new item should be created on itemContainer!
          }

          if (updatedStackQty <= itemToBeAdded.maxStackSize) {
            // if updatedStackQty is less than or equal to maxStackSize, update stackQty of existing item. Do not create new one!

            await this.characterItemSlots.updateItemOnSlot(i, targetContainer, {
              stackQty: updatedStackQty,
            });

            await Item.updateOne(
              {
                _id: slotItem._id,
              },
              { $set: { stackQty: updatedStackQty } }
            );
          }

          // // delete selectedItem to cleanup database (now hes on the container)
          await Item.deleteOne({ _id: itemToBeAdded._id });

          return {
            status: OperationStatus.Success,
          };
        }
      }
    }
    return null;
  }
}
