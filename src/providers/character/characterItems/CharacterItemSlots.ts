import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { isSameKey } from "@providers/dataStructures/KeyHelper";
import { ItemCleanup } from "@providers/item/ItemCleanup";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

import { provide } from "inversify-binding-decorators";

@provide(CharacterItemSlots)
export class CharacterItemSlots {
  constructor(private socketMessaging: SocketMessaging, private itemCleanup: ItemCleanup) {}

  public async getTotalQty(targetContainer: IItemContainer, itemKey: string, itemRarity: string): Promise<number> {
    const allItemsSameKey = await this.getAllItemsFromKey(targetContainer, itemKey);
    let qty = 0;
    for (const item of allItemsSameKey) {
      if (item.stackQty && item.rarity === itemRarity) {
        qty += item.stackQty;
      } else if (item.rarity === itemRarity) {
        qty += 1;
      }
    }

    return qty;
  }

  public getTotalQtyByKey(items: IItem[]): Map<string, number> {
    const res: Map<string, number> = new Map();
    for (const item of items) {
      const itemKey = item.baseKey;
      let existing = res.get(itemKey);
      if (!existing) {
        existing = 0;
      }
      if (item.stackQty) {
        res.set(itemKey, existing + item.stackQty);
      } else {
        res.set(itemKey, existing + 1);
      }
    }
    return res;
  }

  public async getAllItemsFromKey(targetContainer: IItemContainer, itemKey: string): Promise<IItem[]> {
    const items: IItem[] = [];

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i] as unknown as IItem;

      if (!slotItem) continue;

      if (slotItem.key.replace(/-\d+$/, "").toString() === itemKey.replace(/-\d+$/, "").toString()) {
        const dbItem = (await Item.findById(slotItem._id)) as unknown as IItem;

        dbItem && items.push(dbItem);
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

    // remember that we also need to update the item on the database. What we have above is just a reference inside of the container (copy)
    await Item.updateOne(
      {
        _id: slotItem._id,
      },
      { $set: { ...payload } }
    );
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
        targetContainer.slots[i] = null;

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

    if (!(itemToBeAdded.maxStackSize > 1)) {
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

        if (slotItem.maxStackSize > 1) {
          if (isSameKey(slotItem.key, itemToBeAdded.key)) {
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

      if (itemToBeAdded && slotItem && slotItem.maxStackSize > 1) {
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

  public async addItemOnSlot(
    targetContainer: IItemContainer,
    itemToBeAdded: IItem,
    slotIndex: number
  ): Promise<boolean> {
    const targetContainerItem = (await ItemContainer.findById(targetContainer.id)) as unknown as IItemContainer;

    if (!targetContainerItem) {
      return false;
    }

    const slotItem = targetContainerItem.slots[slotIndex] as unknown as IItem;

    if (!slotItem) {
      await ItemContainer.updateOne(
        {
          _id: targetContainerItem._id,
        },
        {
          $set: {
            [`slots.${slotIndex}`]: itemToBeAdded,
          },
        }
      );

      return true;
    }

    return false;
  }

  public async tryAddingItemOnFirstSlot(
    character: ICharacter,
    selectedItem: IItem,
    targetContainer: IItemContainer,
    dropOnMapIfFull: boolean = true
  ): Promise<boolean> {
    const firstAvailableSlotIndex = await this.getFirstAvailableSlotIndex(targetContainer, selectedItem);

    if (firstAvailableSlotIndex === null) {
      if (!dropOnMapIfFull) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, your container is full.");
        return false;
      }

      // if inventory is full, just drop the item on the ground

      selectedItem.x = character.x;
      selectedItem.y = character.y;
      selectedItem.scene = character.scene;
      selectedItem.droppedBy = character._id;
      await selectedItem.save();

      await this.itemCleanup.tryCharacterDroppedItemsCleanup(character);

      return true;
    }

    if (firstAvailableSlotIndex >= 0) {
      targetContainer.slots[firstAvailableSlotIndex] = selectedItem;

      if (!selectedItem._id) {
        return false;
      }

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

      return true;
    }

    return false;
  }
}
