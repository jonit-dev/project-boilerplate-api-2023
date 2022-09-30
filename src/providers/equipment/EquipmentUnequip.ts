import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

import { CharacterItemStack } from "@providers/character/characterItems/CharacterItemStack";
import { CharacterValidation } from "@providers/character/CharacterValidation";
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
import { EquipmentRangeUpdate } from "./EquipmentRangeUpdate";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentUnequip)
export class EquipmentUnequip {
  constructor(
    private equipmentSlots: EquipmentSlots,
    private equipmentHelper: EquipmentRangeUpdate,
    private characterValidation: CharacterValidation,
    private characterItemStack: CharacterItemStack,
    private socketMessaging: SocketMessaging
  ) {}

  public async unequip(
    character: ICharacter,
    inventory: IItem,
    itemId: string,
    item: IItem,
    itemContainer: IItemContainer
  ): Promise<void> {
    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Item not found");

      return;
    }

    if (item && item.isItemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "It's not possible to unequip item container!");

      return;
    }

    if (!itemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Item container not found");

      return;
    }

    this.characterValidation.hasBasicValidation(character);

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "It's not possible to unequip this item without an inventory!"
      );

      return;
    }

    const slots: IItem[] = itemContainer.slots;

    let itemAlreadyInSlot = false;

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Equipment not found");

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

    await this.equipmentHelper.updateCharacterAttackType(character, item);
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
        itemSlot!.stackQty!++; //! THIS IS BUGGED!
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
