import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  IEquipItemPayload,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentEquipNetwork)
export class EquipmentEquipNetwork {
  constructor(private socketAuth: SocketAuth, private socketMessaging: SocketMessaging) {}

  public onItemEquip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.Equip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const itemId = data.itemId;
        const targetSlot = data.targetSlot;
        const item = await Item.findById(itemId);

        const inventory = await character.inventory;

        const itemContainer = await ItemContainer.findOne({
          owner: character.id,
        });

        if (!itemContainer) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Container not found.",
            type: "error",
          });
          return;
        }

        if (!inventory) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Inventory is empty.",
            type: "error",
          });
          return;
        }

        if (inventory.id !== itemId) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "User doesn't have this item",
            type: "error",
          });
          return;
        }

        if (character.isBanned) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "User has been banned!",
            type: "error",
          });
          return;
        }

        if (!character.isAlive) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "User is dead!",
            type: "error",
          });
          return;
        }

        if (!item?.allowedEquipSlotType?.includes(targetSlot)) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Item cannot be equipped in this slot",
            type: "error",
          });
          return;
        }

        const equipment = await Equipment.findById(character.equipment);
        if (equipment) {
          equipment[targetSlot.toLowerCase()] = itemId;
          equipment.inventory = undefined;
          equipment.save();

          await this.removeItemFromInventory(itemId, itemContainer);

          const equipmentSlots = await this.getEquipmentSlots(equipment._id);

          const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
            equipment: {
              _id: equipment._id,
              ...equipmentSlots,
              inventory: {} as IItem,
            },
            inventory: {
              _id: inventory._id,
              parentItem: itemContainer.parentItem.toString(),
              owner: itemContainer?.owner?.toString(),
              name: itemContainer.name,
              slotQty: itemContainer.slotQty,
              slots: itemContainer.slots,
              allowedItemTypes: this.getAllowedItemTypes(),
              isEmpty: itemContainer.isEmpty,
            },
          };

          this.updateItemInventoryCharacter(payloadUpdate, character);
        }
      }
    );
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

  private async getEquipmentSlots(equipmentId: string): Promise<object> {
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

    return {
      head,
      neck,
      leftHand,
      rightHand,
      ring,
      legs,
      boot,
      accessory,
      armor,
    };
  }

  private async removeItemFromInventory(itemId: string, itemContainer: IItemContainer): Promise<void> {
    let index = 0;
    for (let slot in itemContainer.slots) {
      if (slot === itemId) {
        slot = "";
        break;
      }
      index++;
    }

    itemContainer.slots[index] = null;
    await itemContainer.save();
  }

  private getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType in Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
