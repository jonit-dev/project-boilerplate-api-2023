import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
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
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentUnequip)
export class EquipmentUnequip {
  constructor(private socketMessaging: SocketMessaging, private equipmentSlots: EquipmentSlots) {}

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

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);

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

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
