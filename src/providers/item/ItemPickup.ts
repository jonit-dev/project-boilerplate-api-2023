import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { OperationStatus } from "@providers/types/ValidationTypes";
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
import { ItemView } from "./ItemView";
@provide(ItemPickup)
export class ItemPickup {
  constructor(
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private characterWeight: CharacterWeight,
    private itemView: ItemView,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async performItemPickup(itemPickupData: IItemPickup, character: ICharacter): Promise<Boolean> {
    const itemToBePicked = (await Item.findById(itemPickupData.itemId)) as unknown as IItem;

    if (!itemToBePicked) {
      this.sendCustomErrorMessage(character, "Sorry, the item to be picked up was not found.");
      return false;
    }

    const inventory = await character.inventory;
    const isEquipment = itemToBePicked.isItemContainer && inventory === null;
    const isPickupValid = await this.isItemPickupValid(itemToBePicked, itemPickupData, character, isEquipment);
    const isMapContainer =
      itemToBePicked.x !== undefined && itemToBePicked.y !== undefined && itemToBePicked.scene !== undefined;

    if (!isPickupValid) {
      this.sendCustomErrorMessage(character, "Sorry, you cannot pick up this item.");
      return false;
    }

    if (itemToBePicked) {
      await this.normalizeItemKey(itemToBePicked);

      const { status, message } = await this.characterItemContainer.addItemToContainer(
        itemToBePicked,
        character,
        itemPickupData.toContainerId,
        isEquipment
      );

      if (status === OperationStatus.Error) {
        if (message) this.sendCustomErrorMessage(character, message);
        return false;
      }

      // // whenever a new item is added, we need to update the character weight
      await this.characterWeight.updateCharacterWeight(character);

      // we had to proceed with undefined check because remember that x and y can be 0, causing removeItemFromMap to not be triggered!
      if (isMapContainer) {
        // If an item has a x, y and scene, it means its coming from a map pickup. So we should destroy its representation and warn other characters nearby.
        await this.itemView.removeItemFromMap(itemToBePicked);
      } else {
        if (itemPickupData.fromContainerId) {
          const isItemRemoved = await this.removeItemFromContainer(
            itemToBePicked as unknown as IItem,
            character,
            itemPickupData.fromContainerId
          );
          if (!isItemRemoved) {
            return false;
          }
        }
      }

      // send update inventory event to user
      if (!isEquipment) {
        // if the origin container is a MapContainer so should update the char inventory
        //    otherwise will update the origin container (Loot, NPC Shop, Bag on Map)
        const containerToUpdateId = isMapContainer ? itemPickupData.toContainerId : itemPickupData.fromContainerId;
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

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
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

  // this removes any Tiled id from items, that may be added to the key and cause issues
  // eg arrow-123 instead of arrow
  private async normalizeItemKey(item: IItem): Promise<void> {
    item.key = item.key.replace(/-\d+$/, "");

    await item.save();
  }

  private async isItemPickupValid(
    item: IItem,
    itemPickupData: IItemPickup,
    character: ICharacter,
    equipItemContainer: boolean
  ): Promise<Boolean> {
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
      const underRange = this.movementHelper.isUnderRange(
        character.x,
        character.y,
        itemPickupData.x,
        itemPickupData.y,
        1
      );
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
