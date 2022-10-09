import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { ItemView } from "@providers/item/ItemView";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { CharacterWeight } from "./CharacterWeight";
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

@provide(CharacterTrading)
export class CharacterTrading {
  constructor(
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight,
    private itemView: ItemView,
    private equipmentEquip: EquipmentEquip
  ) {}

  public async updateGoldCoins(character: ICharacter): Promise<void> {
    const gold = await this.getTotalGoldCoins(character);

    await Character.updateOne(
      {
        _id: character._id,
      },
      {
        $set: {
          gold,
        },
      }
    );
  }

  public async getTotalGoldCoins(character: ICharacter): Promise<number> {
    const equipment = await Equipment.findById(character.equipment);
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    let totalGold = 0;
    if (equipment) {
      const { head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor, inventory } = equipment;
      const slots: Types.ObjectId[] = [
        head!,
        neck!,
        leftHand!,
        rightHand!,
        ring!,
        legs!,
        boot!,
        accessory!,
        armor!,
        inventory!,
      ];

      for (const slot of slots) {
        const item = await Item.findById(slot).lean();
        if (item) {
          totalGold += item.goldPrice!;
        }
      }
    }

    if (inventoryContainer) {
      for (const bagItem of inventoryContainer.itemIds) {
        const item = await Item.findById(bagItem).lean();
        if (item) {
          totalGold += item.goldPrice!;
        }
      }
    }

    return totalGold;
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

      await this.updateGoldCoins(destinyCharacter);

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

    const gold = await this.getTotalGoldCoins(character);

    const cost = gold - item.goldPrice!;

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

  private async normalizeItemKey(item: IItem): Promise<void> {
    item.key = item.key.replace(/-\d+$/, "");

    await item.save();
  }

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

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
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
}
