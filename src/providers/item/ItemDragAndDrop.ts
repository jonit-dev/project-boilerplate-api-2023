import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  IItemContainer,
  IItemMove,
  ItemSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "./data/index";

@provide(ItemDragAndDrop)
export class ItemDragAndDrop {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private characterItemSlots: CharacterItemSlots
  ) {}

  //! For now, only a move on inventory is allowed.
  public async performItemMove(itemMoveData: IItemMove, character: ICharacter): Promise<boolean> {
    const isMoveValid = await this.isItemMoveValid(itemMoveData, character);
    if (!isMoveValid) {
      return false;
    }

    const itemToBeMoved = await Item.findById(itemMoveData.from.item._id);
    if (!itemToBeMoved) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, item to be moved wasn't found.");
      return false;
    }

    //! item can be null if it's a move to an empty slot
    const itemToBeMovedTo = await Item.findById(itemMoveData.to.item?._id);
    if (!itemToBeMovedTo && itemMoveData.to.item !== null) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, item to be moved to wasn't found.");
      return false;
    }

    if (itemMoveData.to.source !== itemMoveData.from.source) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you can't move items between different sources."
      );
      return false;
    }

    const source = itemMoveData.from.source;

    try {
      switch (source) {
        case "Inventory":
          await this.moveItemInInventory(
            itemMoveData.from,
            itemMoveData.to,
            character,
            itemMoveData.from.containerId,
            itemMoveData.quantity
          );

          const inventoryContainer = (await ItemContainer.findById(
            itemMoveData.from.containerId
          )) as unknown as IItemContainer;

          const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
            inventory: inventoryContainer,
            openEquipmentSetOnUpdate: false,
            openInventoryOnUpdate: false,
          };

          this.sendRefreshItemsEvent(payloadUpdate, character);

          break;
      }

      return true;
    } catch (err) {
      this.socketMessaging.sendErrorMessageToCharacter(character);

      console.log(err);
      return false;
    }
  }

  private async moveItemInInventory(
    from: {
      item: IItem;
      slotIndex: number;
    },
    to: {
      item: IItem | null;
      slotIndex: number;
    },
    character: ICharacter,
    containerId: string,
    quantity?: number
  ): Promise<boolean> {
    const targetContainer = await ItemContainer.findById(containerId);

    if (!from.item) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    if (!targetContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return false;
    }

    if (!quantity && !to.item) {
      await this.characterItemSlots.deleteItemOnSlot(targetContainer, from.item._id);
      await Item.findByIdAndDelete(from.item._id);
    } else if (quantity && from.item.stackQty) {
      if (to.item && to.item.stackQty) {
        const futureQuantity = Math.min(to.item.stackQty + quantity, to.item.maxStackSize);

        await this.characterItemSlots.updateItemOnSlot(to.slotIndex, targetContainer, {
          ...to.item,
          stackQty: futureQuantity,
        } as IItem);

        if (from.item.stackQty - (futureQuantity - to.item.stackQty) <= 0) {
          await this.characterItemSlots.deleteItemOnSlot(targetContainer, from.item._id);
          await Item.findByIdAndDelete(from.item._id);
        } else {
          await this.characterItemSlots.updateItemOnSlot(from.slotIndex, targetContainer, {
            ...from.item,
            stackQty: from.item.stackQty - (futureQuantity - to.item.stackQty),
          } as IItem);
        }
      } else if (quantity >= from.item.stackQty) {
        await this.characterItemSlots.deleteItemOnSlot(targetContainer, from.item._id);
        await Item.findByIdAndDelete(from.item._id);
      } else {
        await this.characterItemSlots.updateItemOnSlot(from.slotIndex, targetContainer, {
          ...from.item,
          stackQty: from.item.stackQty - quantity,
        } as IItem);
      }
    }

    if (!to.item) {
      const blueprint = itemsBlueprintIndex[from.item.key];
      if (!blueprint) {
        return false;
      }

      const item = new Item({
        ...blueprint,
        attack: from.item.attack ?? blueprint.attack,
        defense: from.item.defense ?? blueprint.defense,
        rarity: from.item.rarity ?? blueprint.rarity,
        stackQty: quantity ?? from.item.stackQty,
      });

      await item.save();

      await this.characterItemSlots.addItemOnSlot(targetContainer, item, to.slotIndex);
    }

    return true;
  }

  private async isItemMoveValid(itemMove: IItemMove, character: ICharacter): Promise<Boolean> {
    const itemFrom = await Item.findById(itemMove.from.item._id);
    const itemTo = await Item.findById(itemMove.to.item?._id);

    // TODO: Add other sources to move from or to in future
    const isInventory = itemMove.from.source === "Inventory" && itemMove.to.source === "Inventory";
    if (!itemFrom || (!itemTo && itemMove.to.item !== null) || !isInventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, this item is not accessible.");
      return false;
    }

    const inventory = await character.inventory;
    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must have a bag or backpack to move this item."
      );
      return false;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);
    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, inventory container not found.");
      return false;
    }

    const hasItemToMoveInInventory = inventoryContainer?.itemIds?.find(
      (itemId) => String(itemId) === String(itemFrom._id)
    );
    const hasItemToMoveToInInventory =
      itemTo === null || inventoryContainer?.itemIds?.find((itemId) => String(itemId) === String(itemTo._id));

    if (!hasItemToMoveInInventory || !hasItemToMoveToInInventory) {
      // this.socketMessaging.sendErrorMessageToCharacter(
      //   character,
      //   "Sorry, you do not have this item in your inventory."
      // );
      return false;
    }

    if (
      itemMove.from.containerId.toString() !== inventoryContainer?.id.toString() ||
      itemMove.to.containerId.toString() !== inventoryContainer?.id.toString()
    ) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, this item does not belong to your inventory."
      );
      return false;
    }

    const toSlotItem = inventoryContainer.slots[itemMove.to.slotIndex];

    if (toSlotItem && toSlotItem.key !== itemMove.from.item.key) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you cannot move items of different types.");
      return false;
    }

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you must have a bag or backpack to move this item."
      );
      return false;
    }

    return this.characterValidation.hasBasicValidation(character);
  }

  private sendRefreshItemsEvent(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
