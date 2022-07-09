import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  IEquipementSet,
  IEquipItemPayload,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  ItemSlotType,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentEquipNetwork)
export class EquipmentEquipNetwork {
  constructor(
    private movementHelper: MovementHelper,
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging
  ) {}

  public onItemEquip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.Equip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const itemId = data.itemId;
        const targetSlot = data.targetSlot;
        const item = (await Item.findById(itemId)) as unknown as IItem;
        const equipItemFromMap = false;

        const inventory = (await character.inventory) as unknown as IItem;

        const itemContainer = (await ItemContainer.findOne({
          owner: character.id,
        })) as IItemContainer;

        const isEquipValid = this.validateEquip(
          item,
          character,
          itemContainer,
          inventory,
          equipItemFromMap,
          itemId,
          targetSlot
        );

        if (!isEquipValid) {
          return;
        }

        const equipment = await Equipment.findById(character.equipment);
        if (equipment) {
          equipment[targetSlot.toLowerCase()] = await this.getItemId(equipItemFromMap, item as unknown as IItem);
          equipment.inventory = equipItemFromMap === false ? undefined : equipment.inventory;
          await equipment.save();

          if (!equipItemFromMap) {
            await this.removeItemFromInventory(itemId, itemContainer!);
          } else {
            await this.removeItemFromMap(itemId);
          }

          const equipmentSlots = await this.getEquipmentSlots(equipment._id);

          const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
            equipment: equipmentSlots,
            inventory: {
              _id: inventory._id,
              parentItem: itemContainer!.parentItem.toString(),
              owner: itemContainer?.owner?.toString() || character.name,
              name: itemContainer?.name,
              slotQty: itemContainer!.slotQty,
              slots: itemContainer?.slots,
              allowedItemTypes: this.getAllowedItemTypes(),
              isEmpty: itemContainer!.isEmpty,
            },
          };

          this.updateItemInventoryCharacter(payloadUpdate, character);
        }
      }
    );
  }

  private validateEquip(
    item: IItem,
    character: ICharacter,
    itemContainer: IItemContainer,
    inventory: IItem,
    equipItemFromMap: boolean,
    itemId: string,
    targetSlot: ItemSlotType
  ): boolean {
    if (!item) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Item not found.",
        type: "error",
      });
      return false;
    }

    if (!item.x) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Invalid item coordinates",
        type: "error",
      });
      return false;
    }

    if (!item.y) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Invalid item coordinates",
        type: "error",
      });
      return false;
    }

    const itemIsOnRange = this.isItemOnRange(character, item as unknown as IItem);

    if (itemIsOnRange) {
      equipItemFromMap = true;
    }

    if (!equipItemFromMap && !itemContainer) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Container not found.",
        type: "error",
      });
      return false;
    }

    if (!equipItemFromMap && !inventory) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Inventory is empty.",
        type: "error",
      });
      return false;
    }

    if (equipItemFromMap && inventory._id !== itemId) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Item is out of range!",
        type: "error",
      });
      return false;
    }

    if (!equipItemFromMap && inventory._id !== itemId) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "User doesn't have this item",
        type: "error",
      });
      return false;
    }

    if (character.isBanned) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "User has been banned!",
        type: "error",
      });
      return false;
    }

    if (!character.isAlive) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "User is dead!",
        type: "error",
      });
      return false;
    }

    if (!item?.allowedEquipSlotType?.includes(targetSlot)) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Item cannot be equipped in this slot",
        type: "error",
      });
      return false;
    }
    return true;
  }

  private updateItemInventoryCharacter(
    equipmentAndInventoryUpdate: IEquipmentAndInventoryUpdatePayload,
    character: ICharacter
  ): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      equipmentAndInventoryUpdate
    );
  }

  public isItemOnRange(character: ICharacter, item: IItem): boolean {
    return this.movementHelper.isUnderRange(character.x, character.y, item.x!, item.y!, 1);
  }

  public async getItemId(equipItemFromMap: boolean, item: IItem): Promise<string> {
    if (!equipItemFromMap) {
      return item._id;
    }

    let newItem = new Item({
      ...item,
    });

    newItem.name = item.name;
    newItem.weight = item.weight;
    newItem.textureKey = item.textureKey;
    newItem.texturePath = item.texturePath;
    newItem.key = item.key;
    newItem.description = item.description;

    newItem = await newItem.save();

    return newItem._id;
  }

  private async removeItemFromMap(itemId: string): Promise<void> {
    await Item.deleteOne({ _id: itemId });
  }

  public async getEquipmentSlots(equipmentId: string): Promise<IEquipementSet> {
    const equipment = await Equipment.findById(equipmentId)
      .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
      .exec();

    const head = equipment?.head! as unknown as IItem;
    const neck = equipment?.neck! as unknown as IItem;
    const leftHand = equipment?.leftHand! as unknown as IItem;
    const rightHand = equipment?.rightHand! as unknown as IItem;
    const ring = equipment?.ring! as unknown as IItem;
    const legs = equipment?.legs! as unknown as IItem;
    const boot = equipment?.boot! as unknown as IItem;
    const accessory = equipment?.accessory! as unknown as IItem;
    const armor = equipment?.armor! as unknown as IItem;
    const inventory = equipment?.inventory! as unknown as IItem;

    return {
      _id: equipment!._id,
      head,
      neck,
      leftHand,
      rightHand,
      ring,
      legs,
      boot,
      accessory,
      armor,
      inventory,
    };
  }

  public async removeItemFromInventory(itemId: string, itemContainer: IItemContainer): Promise<void> {
    let index = 0;
    for (let slot in itemContainer.slots) {
      if (itemContainer.slots[slot] && itemContainer.slots[slot]._id === itemId) {
        slot = "";
        break;
      }
      index++;
    }

    itemContainer.slots[index] = null;
    await itemContainer.save();
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
