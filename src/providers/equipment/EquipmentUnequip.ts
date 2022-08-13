import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentUnequip)
export class EquipmentUnequip {
  constructor(private socketMessaging: SocketMessaging, private equipmentSlots: EquipmentSlots) {}

  public async unequip(
    character: ICharacter,
    inventory: IItem,
    itemId: string,
    item: IItem,
    itemContainer: IItemContainer
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

    let targetSlot = "";
    const itemSlotTypes = [
      "head",
      "neck",
      "leftHand",
      "rightHand",
      "ring",
      "legs",
      "boot",
      "accessory",
      "armor",
      "inventory",
    ];
    for (const itemSlotType of itemSlotTypes) {
      if (equipment[itemSlotType] && equipment[itemSlotType].toString() === itemId) {
        targetSlot = itemSlotType;
      }
    }

    equipment[targetSlot] = undefined;

    const itemSlot = this.checkIfItemAlreadyInSlot(slots, item, equipment as IEquipment, targetSlot);

    if (itemSlot) {
      itemAlreadyInSlot = true;
    }

    this.manageItemContainerSlots(itemAlreadyInSlot, character, itemContainer, itemSlot!, item);

    await equipment.save();
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
      inventory: {
        _id: itemContainer._id,
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

  public checkIfItemAlreadyInSlot(slots: IItem[], item: IItem, equipment: IEquipment, targetSlot: string): IItem {
    let itemSlot: IItem;
    for (const slot in slots) {
      if (slots[slot] && slots[slot].textureKey === item.textureKey) {
        itemSlot = slots[slot];

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
    let itemUnequipped = false;
    if (itemAlreadyInSlot) {
      if (itemSlot!.stackQty! < itemSlot!.maxStackSize) {
        itemSlot!.stackQty!++;
        itemUnequipped = true;
      }
    }
    if (!itemUnequipped && itemContainer.totalItemsQty < itemContainer.slotQty) {
      for (const index in itemContainer.slots) {
        if (itemContainer.slots[index] === null) {
          itemContainer.slots[index] = item;
          itemUnequipped = true;
          break;
        }
      }
    }
    if (!itemUnequipped) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "There aren't slots available",
        type: "error",
      });
      return;
    }

    await ItemContainer.updateOne(
      {
        _id: itemContainer.id,
      },
      {
        $set: {
          slots: itemContainer.slots,
        },
      }
    );
  }

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }
}
