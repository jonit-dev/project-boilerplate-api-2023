import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  IEquipItemPayload,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  IItemContainer,
  ItemSocketEvents,
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
        const itemType = data.targetSlot;
        const item = await Item.findById(itemId);

        const inventory = await character.inventory;

        if (
          inventory &&
          inventory.id === itemId &&
          !character.isBanned &&
          character.isAlive &&
          item?.allowedEquipSlotType?.includes(itemType)
        ) {
          const equipment = await Equipment.findById(character.equipment)
            .populate("head neck leftHand rightHand ring legs boot accessory armor inventory")
            .exec();

          if (equipment) {
            const head = equipment.head! as unknown as IItem;
            const neck = equipment.neck! as unknown as IItem;
            const leftHand = equipment.leftHand! as unknown as IItem;
            const rightHand = equipment.rightHand! as unknown as IItem;
            const ring = equipment.ring! as unknown as IItem;
            const legs = equipment.legs! as unknown as IItem;
            const boot = equipment.boot! as unknown as IItem;
            const accessory = equipment.accessory! as unknown as IItem;
            const armor = equipment.armor! as unknown as IItem;

            equipment[itemType.toLowerCase()] = itemId;
            equipment.inventory = "";
            equipment.save();

            const inventoryUser = await ItemContainer.find({
              owner: character.id,
            });

            let index = 0;
            for (let slot in inventoryUser.slots) {
              if (slot === itemId) {
                slot = "";
                break;
              }
              index++;
            }

            inventoryUser.slots[index] = null;
            await inventoryUser.save();

            const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
              equipment: {
                _id: equipment._id,
                head,
                neck,
                leftHand,
                rightHand,
                ring,
                legs,
                boot,
                armor,
                accessory,
                inventory: {} as IItem,
              },
              inventory: inventoryUser as unknown | IItemContainer,
            };

            this.updateItemInventoryCharacter(payloadUpdate, character);
          }
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
}
