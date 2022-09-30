import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { CharacterItems } from "@providers/character/characterItems/CharacterItems";

import { CharacterItemStack } from "@providers/character/characterItems/CharacterItemStack";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItem, ItemSocketEvents, ItemType } from "@rpg-engine/shared";
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
    private socketMessaging: SocketMessaging,
    private characterItems: CharacterItems
  ) {}

  public async unequip(character: ICharacter, inventory: IItem, itemId: string, item: IItem): Promise<void> {
    const inventoryContainer = (await ItemContainer.findById(
      inventory.itemContainer as string
    )) as unknown as IItemContainer;

    const isUnequipValid = this.isUnequipValid(inventory, inventoryContainer, character, item);

    if (!isUnequipValid) {
      return;
    }

    const slots: IItem[] = inventoryContainer.slots;

    let itemAlreadyInSlot = false;

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Equipment not found");

      return;
    }

    let unequipOriginSlot = this.getUnequipOriginSlot(equipment, itemId);

    if (!unequipOriginSlot) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Target slot not found!");

      return;
    }

    equipment[unequipOriginSlot] = undefined;

    const itemSlot = this.checkIfItemAlreadyInSlot(slots, item);

    if (itemSlot) {
      itemAlreadyInSlot = true;
    }

    this.manageItemContainerSlots(itemAlreadyInSlot, character, inventoryContainer, itemSlot!, item);

    await equipment.save();
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      equipment: equipmentSlots,
      inventory: {
        _id: inventoryContainer._id,
        parentItem: inventoryContainer!.parentItem.toString(),
        owner: inventoryContainer?.owner?.toString() || character.name,
        name: inventoryContainer?.name,
        slotQty: inventoryContainer!.slotQty,
        slots: inventoryContainer?.slots,
        allowedItemTypes: this.getAllowedItemTypes(),
        isEmpty: inventoryContainer!.isEmpty,
      },
    };

    this.updateItemInventoryCharacter(payloadUpdate, character);

    await this.equipmentHelper.updateCharacterAttackType(character, item);
  }

  public checkIfItemAlreadyInSlot(slots: IItem[], item: IItem): IItem {
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
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, there aren't slots available");

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

  private getUnequipOriginSlot(equipment: IEquipment, itemId: string): string | undefined {
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
        return itemSlotType;
      }
    }
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

  private isUnequipValid(
    inventory: IItem,
    inventoryContainer: IItemContainer,
    character: ICharacter,
    item: IItem
  ): boolean {
    const userHasItemToUnequip = this.characterItems.hasItem(item._id, character, "equipment");

    if (!userHasItemToUnequip) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "You're trying to unequip an item that you don't own!"
      );

      return false;
    }

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Item not found");

      return false;
    }

    if (item && item.isItemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "It's not possible to unequip item container!");

      return false;
    }

    if (!inventoryContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Item container not found");

      return false;
    }

    const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "It's not possible to unequip this item without an inventory!"
      );

      return false;
    }

    return true;
  }
}
