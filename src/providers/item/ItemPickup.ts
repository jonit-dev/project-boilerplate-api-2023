import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterTrading } from "@providers/character/CharacterTrading";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  IItemPickup,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UIMessageType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentEquip } from "../equipment/EquipmentEquip";
import { ItemView } from "./ItemView";
@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight,
    private characterTrading: CharacterTrading,
    private itemView: ItemView,
    private equipmentEquip: EquipmentEquip
  ) {}

  public async performItemPickup(itemPickup: IItemPickup, character: ICharacter): Promise<Boolean> {
    const pickupItem = (await Item.findById(itemPickup.itemId)) as unknown as IItem;

    if (!pickupItem) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const inventario = await character.inventory;
    const equipItemContainer = pickupItem.isItemContainer && inventario === null;
    const isPickupValid = await this.isItemPickupValid(itemPickup, character, equipItemContainer);
    const isMapContainer = pickupItem.x !== undefined && pickupItem.y !== undefined && pickupItem.scene !== undefined;

    if (!isPickupValid) {
      return false;
    }

    if (pickupItem) {
      await this.normalizeItemKey(pickupItem);

      const isItemAdded = await this.addItemToInventory(
        pickupItem,
        character,
        itemPickup.toContainerId,
        equipItemContainer
      );
      if (!isItemAdded) return false;

      // // whenever a new item is added, we need to update the character weight
      await this.characterWeight.updateCharacterWeight(character);

      // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
      if (isMapContainer) {
        // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
        await this.itemView.removeItemFromMap(pickupItem);
      } else {
        if (itemPickup.fromContainerId) {
          const isItemRemoved = await this.removeItemFromContainer(
            pickupItem as unknown as IItem,
            character,
            itemPickup.fromContainerId
          );
          if (!isItemRemoved) {
            return false;
          }
        }
      }

      // send update inventory event to user
      if (!equipItemContainer) {
        // if the origin container is a MapContainer so should update the char inventory
        //    otherwise will update the origin container (Loot, NPC Shop, Bag on Map)
        const containerToUpdateId = isMapContainer ? itemPickup.toContainerId : itemPickup.fromContainerId;
        const updatedContainer = (await ItemContainer.findById(containerToUpdateId)) as unknown as IItemContainer;
        const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
          equipment: {} as unknown as IEquipmentSet,
          inventory: {
            _id: updatedContainer._id,
            parentItem: updatedContainer!.parentItem.toString(),
            owner: updatedContainer?.owner?.toString() || character.name,
            name: updatedContainer?.name,
            slotQty: updatedContainer!.slotQty,
            slots: updatedContainer?.slots,
            allowedItemTypes: this.getAllowedItemTypes(),
            isEmpty: updatedContainer!.isEmpty,
          },
        };

        this.updateInventoryCharacter(payloadUpdate, character);
      }
      return true;
    }
    return false;
  }

  public async performItemSell(
    itemSell: IItemPickup,
    character: ICharacter,
    destinyCharacter: ICharacter
  ): Promise<Boolean> {
    const sellItem = (await Item.findById(itemSell.itemId)) as unknown as IItem;

    if (!sellItem) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const inventario = await character.inventory;
    const equipItemContainer = sellItem.isItemContainer && inventario === null;
    const isSellValid = await this.isItemSellValid(itemSell, character, equipItemContainer);
    const isMapContainer = sellItem.x !== undefined && sellItem.y !== undefined && sellItem.scene !== undefined;

    if (!isSellValid) {
      return false;
    }

    if (sellItem) {
      await this.normalizeItemKey(sellItem);

      const isItemRemoved = await this.removeItemFromContainer(
        sellItem,
        character,
        itemSell.toContainerId //,
        // equipItemContainer
      );
      if (!isItemRemoved) return false;

      // // whenever a new item is added, we need to update the character weight
      await this.characterWeight.updateCharacterWeight(character);

      await this.characterTrading.updateCharacterGold(destinyCharacter);

      // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
      if (isMapContainer) {
        // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
        await this.itemView.removeItemFromMap(sellItem);
      } else {
        if (itemSell.fromContainerId) {
          const isItemRemoved = await this.removeItemFromContainer(
            sellItem as unknown as IItem,
            character,
            itemSell.fromContainerId
          );
          if (!isItemRemoved) {
            return false;
          }
        }
      }

      // send update inventory event to user
      if (!equipItemContainer) {
        // if the origin container is a MapContainer so should update the char inventory
        //    otherwise will update the origin container (Loot, NPC Shop, Bag on Map)
        const containerToUpdateId = isMapContainer ? itemSell.toContainerId : itemSell.fromContainerId;
        const updatedContainer = (await ItemContainer.findById(containerToUpdateId)) as unknown as IItemContainer;
        const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
          equipment: {} as unknown as IEquipmentSet,
          inventory: {
            _id: updatedContainer._id,
            parentItem: updatedContainer!.parentItem.toString(),
            owner: updatedContainer?.owner?.toString() || character.name,
            name: updatedContainer?.name,
            slotQty: updatedContainer!.slotQty,
            slots: updatedContainer?.slots,
            allowedItemTypes: this.getAllowedItemTypes(),
            isEmpty: updatedContainer!.isEmpty,
          },
        };

        this.updateInventoryCharacter(payloadUpdate, character);
      }
      const hasTransferedToDestiny = await this.addItemToInventory(
        sellItem,
        destinyCharacter,
        itemSell.fromContainerId!,
        equipItemContainer
      );
      return hasTransferedToDestiny;
    }

    return false;
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  /**
   * This method will add or stack a item to the character inventory
   */
  private async addItemToInventory(
    item: IItem,
    character: ICharacter,
    toContainerId: string,
    equipItemContainer: boolean
  ): Promise<Boolean> {
    const selectedItem = (await Item.findById(item.id)) as IItem;

    if (!selectedItem) {
      this.sendGenericErrorMessage(character);
      return false;
    }

    // Equip Item Container
    if (equipItemContainer) {
      await this.equipmentEquip.equip(character, item.id, "");
      return true;
    }

    const targetContainer = (await ItemContainer.findById(toContainerId)) as unknown as IItemContainer;

    if (!targetContainer) {
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (targetContainer) {
      let isNewItem = true;

      // Item Type is valid to add to a container?
      const isItemTypeValid = targetContainer.allowedItemTypes?.filter((entry) => {
        return entry === selectedItem?.type;
      });
      if (!isItemTypeValid) {
        this.sendCustomErrorMessage(character, "Sorry, your inventory does not support this item type.");
        return false;
      }

      // Inventory is empty, slot checking not needed
      if (targetContainer.isEmpty) isNewItem = true;

      if (selectedItem.isStackable) {
        const itemStacked = await this.tryAddingItemToStack(character, targetContainer, selectedItem);
        if (itemStacked) {
          // if was stacked, remove the item from the database to avoid garbage
          await Item.deleteOne({ _id: selectedItem.id });
          return true;
        }
      }

      // Check's done, need to create new item on char inventory
      if (isNewItem) {
        const firstAvailableSlotIndex = targetContainer.firstAvailableSlotId;

        if (firstAvailableSlotIndex === null) {
          this.sendCustomErrorMessage(character, "Sorry, your inventory is full.");
          return false;
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

          return true;
        }
      }
    }

    return false;
  }

  // not a final solution
  private async removeItemFromContainer(
    item: IItem,
    character: ICharacter,
    fromContainerId: string | undefined
  ): Promise<Boolean> {
    const selectedItem = (await Item.findById(item.id)) as IItem;
    if (!selectedItem) {
      this.sendGenericErrorMessage(character);
      return false;
    }

    const targetContainer = (await ItemContainer.findById(fromContainerId)) as unknown as IItemContainer;
    if (!targetContainer) {
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (targetContainer) {
      // // Inventory is empty, slot checking not needed
      for (let i = 0; i < targetContainer.slotQty; i++) {
        const slotItem = targetContainer.slots?.[i];

        if (!slotItem) continue;
        if (slotItem.key === item.key) {
          // Changing item slot to null, thus removing it
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
    }
    return false;
  }

  private async tryAddingItemToStack(
    character: ICharacter,
    targetContainer: IItemContainer,
    selectedItem: IItem
  ): Promise<boolean> {
    // loop through all inventory container slots, checking to see if selectedItem can be stackable

    if (!targetContainer.slots) {
      this.sendCustomErrorMessage(character, "Sorry, there are no slots in your container.");
      return false;
    }

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i];

      if (!slotItem) continue;

      if (slotItem.key === selectedItem.key.replace(/-\d+$/, "")) {
        if (slotItem.stackQty) {
          const updatedStackQty = slotItem.stackQty + selectedItem.stackQty;
          if (updatedStackQty > slotItem.maxStackSize) {
            this.sendCustomErrorMessage(
              character,
              `Sorry, you cannot stack more than ${slotItem.maxStackSize} ${slotItem.key}s.`
            );
            return false;
          }

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

          return true;
        }
      }
    }
    return false;
  }

  // this removes any Tiled id from items, that may be added to the key and cause issues
  // eg arrow-123 instead of arrow
  private async normalizeItemKey(item: IItem): Promise<void> {
    item.key = item.key.replace(/-\d+$/, "");

    await item.save();
  }

  private async isItemPickupValid(
    itemPickup: IItemPickup,
    character: ICharacter,
    equipItemContainer: boolean
  ): Promise<Boolean> {
    const item = await Item.findById(itemPickup.itemId);

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const isItemOnMap = item.x && item.y && item.scene;

    const inventory = await character.inventory;

    if (!inventory && !equipItemContainer) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to pick up this item.");
      return false;
    }

    if (isItemOnMap) {
      if (character.scene !== item.scene) {
        this.sendCustomErrorMessage(character, "Sorry, you can't pick up items from another map.");
        return false;
      }
    }

    const weight = await this.characterWeight.getWeight(character);
    const maxWeight = await this.characterWeight.getMaxWeight(character);

    const ratio = (weight + item.weight) / maxWeight;

    if (ratio > 4) {
      this.sendCustomErrorMessage(character, "Sorry, you are already carrying too much weight!");
      return false;
    }

    if (!item.isStorable) {
      this.sendCustomErrorMessage(character, "Sorry, you cannot store this item.");
      return false;
    }

    if (item.x !== undefined && item.y !== undefined && item.scene !== undefined) {
      const underRange = this.movementHelper.isUnderRange(character.x, character.y, itemPickup.x, itemPickup.y, 1);
      if (!underRange) {
        this.sendCustomErrorMessage(character, "Sorry, you are too far away to pick up this item.");
        return false;
      }
    }

    if (!isItemOnMap) {
      // if item is not on the map

      if (item.owner && item.owner !== character._id.toString()) {
        // check if item is owned by someone else
        this.sendCustomErrorMessage(character, "Sorry, this item is not yours.");
        return false;
      }
    }

    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned and can't pick up this item.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you must be online to pick up this item.");
      return false;
    }

    return true;
  }

  private async isItemSellValid(
    itemSell: IItemPickup,
    character: ICharacter,
    equipItemContainer: boolean
  ): Promise<Boolean> {
    const item = await Item.findById(itemSell.itemId);

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    const isItemOnMap = item.x && item.y && item.scene;

    const inventory = await character.inventory;

    if (!inventory && !equipItemContainer) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to pick up this item.");
      return false;
    }

    if (isItemOnMap) {
      if (character.scene !== item.scene) {
        this.sendCustomErrorMessage(character, "Sorry, you can't pick up items from another map.");
        return false;
      }
    }

    const weight = await this.characterWeight.getWeight(character);
    const maxWeight = await this.characterWeight.getMaxWeight(character);

    const ratio = (weight + item.weight) / maxWeight;

    if (ratio > 4) {
      this.sendCustomErrorMessage(character, "Sorry, you are already carrying too much weight!");
      return false;
    }

    const gold = await this.characterGold.getGold(character);

    const cost = gold - item.gold!;

    if (cost < 0) {
      this.sendCustomErrorMessage(character, "Sorry, not enough gold to sell this item.");
      return false;
    }

    if (!item.isStorable) {
      this.sendCustomErrorMessage(character, "Sorry, you cannot store this item.");
      return false;
    }

    if (item.x !== undefined && item.y !== undefined && item.scene !== undefined) {
      const underRange = this.movementHelper.isUnderRange(character.x, character.y, itemSell.x, itemSell.y, 1);
      if (!underRange) {
        this.sendCustomErrorMessage(character, "Sorry, you are too far away to sell this item.");
        return false;
      }
    }

    if (!isItemOnMap) {
      // if item is not on the map

      if (item.owner && item.owner !== character._id.toString()) {
        // check if item is owned by someone else
        this.sendCustomErrorMessage(character, "Sorry, this item is not yours.");
        return false;
      }
    }

    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned and can't sell this item.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you must be online to sell this item.");
      return false;
    }

    return true;
  }

  public sendGenericErrorMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "Sorry, failed to add your item your inventory.",
      type: "error",
    });
  }

  public sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
