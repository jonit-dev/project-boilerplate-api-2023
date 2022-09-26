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
    selectedItem: IItem
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

      if (slotItem.key === selectedItem.key.replace(/-\d+$/, "")) {
        if (slotItem.stackQty) {
          const updatedStackQty = slotItem.stackQty + selectedItem.stackQty;

          if (updatedStackQty > selectedItem.maxStackSize) {
            // update stackQty of existing item
            targetContainer.slots[i] = {
              ...slotItem,
              stackQty: selectedItem.maxStackSize,
            };

            targetContainer.markModified("slots");
            await targetContainer.save();

            selectedItem.stackQty = updatedStackQty - selectedItem.maxStackSize;
            await selectedItem.save();

            return null; // this means a new item should be created on itemContainer!
          }

          if (updatedStackQty <= selectedItem.maxStackSize) {
            // if updatedStackQty is less than or equal to maxStackSize, update stackQty of existing item. Do not create new one!

            targetContainer.slots[i] = {
              ...slotItem,
              stackQty: updatedStackQty,
            };

            await Item.updateOne(
              {
                _id: slotItem._id,
              },
              { $set: { stackQty: updatedStackQty } }
            );

            targetContainer.markModified("slots");
            await targetContainer.save();
          }

          // delete selectedItem to cleanup database (now hes on the container)
          await Item.deleteOne({ _id: selectedItem._id });

          return {
            status: OperationStatus.Success,
          };
        }
      }
    }
    return null;
  }
}
