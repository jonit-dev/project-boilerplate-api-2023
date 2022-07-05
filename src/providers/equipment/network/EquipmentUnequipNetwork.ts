import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { EquipmentRead } from "./EquipmentRead";
import {
  IEquipementSet,
  IEquipItemPayload,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { ObjectId } from "bson";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(EquipmentUnequipNetwork)
export class EquipmentUnequipNetwork {
  constructor(
    private movementHelper: MovementHelper,
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging
  ) {}

  public onItemUnequip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ItemSocketEvents.Equip,
      async (data: IEquipItemPayload, character: ICharacter) => {
        const itemId = data.itemId;
        const targetSlot = data.targetSlot;
        const item = (await Item.findById(itemId)) as unknown as IItem;

        const inventory = await character.inventory;

        const itemContainer = await ItemContainer.findOne({
          owner: character.id,
        });

        if (!item) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Item not found.",
            type: "error",
          });
          return;
        }

        if (!itemContainer) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Container not found.",
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

        const slots: IItem[] = itemContainer.slots;

        let itemAlreadyInSlot = false;
        let itemSlot: IItem;

        const equipment = await Equipment.findById(character.equipment);

        if (!equipment) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Equipment set not found!",
            type: "error",
          });
          return;
        }

        equipment[targetSlot.toLowerCase()] = undefined;

        equipment.inventory = new ObjectId(item._id) as unknown as Types.ObjectId;
        await equipment.save();

        for (const slot of slots) {
          if (slot.tiledId === item.tiledId) {
            itemAlreadyInSlot = true;
            itemSlot = slot;
            equipment[targetSlot.toLowerCase()] = undefined;
            break;
          }
        }

        if (itemAlreadyInSlot) {
          if (itemSlot!.stackQty! < itemSlot!.maxStackSize) {
            itemSlot!.stackQty!++;
          } else {
            this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
              message: "There aren't slots available",
              type: "error",
            });
            return;
          }
        } else {
          if (itemContainer.totalItemsQty < itemContainer.slotQty) {
            itemContainer.slots.push(item);
          } else {
            this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
              message: "There aren't slots available",
              type: "error",
            });
            return;
          }
        }

        await itemContainer.save();
        const equipmentRead = new EquipmentRead(this.socketAuth, this.socketMessaging);
        const equipmentSlots = await equipmentRead.getEquipmentSlots(equipment._id);

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

  // private async getEquipmentSlots(equipmentId: string): Promise<IEquipementSet> {
  //   const equipment = await Equipment.findById(equipmentId)
  //     .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
  //     .exec();

  //   const head = equipment?.head! as unknown as IItem;
  //   const neck = equipment?.neck! as unknown as IItem;
  //   const leftHand = equipment?.leftHand! as unknown as IItem;
  //   const rightHand = equipment?.rightHand! as unknown as IItem;
  //   const ring = equipment?.ring! as unknown as IItem;
  //   const legs = equipment?.legs! as unknown as IItem;
  //   const boot = equipment?.boot! as unknown as IItem;
  //   const accessory = equipment?.accessory! as unknown as IItem;
  //   const armor = equipment?.armor! as unknown as IItem;
  //   const inventory = equipment?.inventory! as unknown as IItem;

  //   return {
  //     _id: equipment!._id,
  //     head,
  //     neck,
  //     leftHand,
  //     rightHand,
  //     ring,
  //     legs,
  //     boot,
  //     accessory,
  //     armor,
  //     inventory,
  //   } as IEquipementSet;
  // }

  private getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType in Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
