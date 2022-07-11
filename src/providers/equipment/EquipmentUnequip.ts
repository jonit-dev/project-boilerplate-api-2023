import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipementSet,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  ItemSlotType,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(EquipmentUnequip)
export class EquipmentUnequip {
  constructor(private socketMessaging: SocketMessaging) {}

  public async unequip(
    character: ICharacter,
    inventory: IItem,
    item: IItem,
    itemContainer: IItemContainer,
    targetSlot: ItemSlotType
  ): Promise<void> {
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

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Equipment set not found!",
        type: "error",
      });
      return;
    }

    const itemSlot = this.unEquipItemFromEquipmentSlot(slots, item, equipment as IEquipment, targetSlot.toLowerCase());

    if (itemSlot) {
      itemAlreadyInSlot = true;
    }

    equipment.inventory = new Types.ObjectId(item._id) as unknown as Types.ObjectId;
    await equipment.save();

    this.manageItemContainerSlots(itemAlreadyInSlot, character, itemContainer, itemSlot!, item);

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

  public unEquipItemFromEquipmentSlot(slots: IItem[], item: IItem, equipment: IEquipment, targetSlot: string): IItem {
    let itemSlot: IItem;
    for (const slot in slots) {
      if (slots[slot] && slots[slot].tiledId === item.tiledId) {
        itemSlot = slots[slot];
        equipment[targetSlot.toLowerCase()] = undefined;
        break;
      }
    }
    return itemSlot!;
  }

  public async manageItemContainerSlots(
    itemAlreadyInSlot: boolean,
    character: ICharacter,
    itemContainer: IItemContainer,
    itemSlot: IItem,
    item: IItem
  ): Promise<void> {
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
        for (const index in itemContainer.slots) {
          if (itemContainer.slots[index] === null) {
            itemContainer.slots[index] = item;
            break;
          }
        }
      } else {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "There aren't slots available",
          type: "error",
        });
        return;
      }
    }

    const itemContainerModel = await ItemContainer.findById(itemContainer._id).populate("slots").exec();

    if (itemContainerModel) {
      itemContainerModel.slots = itemContainer.slots;

      await itemContainerModel!.save();
    }
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
    } as IEquipementSet;
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
