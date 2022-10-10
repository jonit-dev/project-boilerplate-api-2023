import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { isSameKey } from "@providers/dataStructures/KeyHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentSet } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { camelCase } from "lodash";

export type EquipmentSlotTypes =
  | "head"
  | "neck"
  | "leftHand"
  | "rightHand"
  | "ring"
  | "legs"
  | "boot"
  | "accessory"
  | "armor"
  | "inventory";

@provide(EquipmentSlots)
export class EquipmentSlots {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer,
    private characterItemsInventory: CharacterItemInventory
  ) {}

  private slots: EquipmentSlotTypes[] = [
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

  public async addItemToEquipmentSlot(character: ICharacter, item: IItem, equipment: IEquipment): Promise<boolean> {
    const equipmentSet = await this.getEquipmentSlots(equipment._id);

    const availableSlot = this.getAvailableSlot(item, equipmentSet);

    if (!availableSlot) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you don't have any available slots for this item."
      );
      return false;
    }

    if (item.isStackable) {
      const targetSlotItemId = equipmentSet[availableSlot];
      const targetSlotItem = await Item.findById(targetSlotItemId);

      if (!targetSlotItem) {
        equipment[availableSlot] = item;
        await equipment.save();
        await this.characterItemsInventory.deleteItemFromInventory(item.id, character);

        return true;
      }

      const futureStackSize = targetSlotItem.stackQty! + item.stackQty!;

      if (isSameKey(targetSlotItem?.key, item.key)) {
        // if we have the same item, check if the stack is full or not
        if (futureStackSize <= targetSlotItem?.maxStackSize) {
          targetSlotItem.stackQty! = futureStackSize;
          await targetSlotItem?.save();

          return true; // just add it to the existing stack, and that's it.
        } else {
          // calculate the difference
          const difference = Math.abs(targetSlotItem?.maxStackSize - futureStackSize);

          // set the stack to max
          targetSlotItem.stackQty! = targetSlotItem?.maxStackSize;
          await targetSlotItem?.save();

          // set the item to the difference
          item.stackQty! = difference;
          await item.save();

          // then add it to the inventory

          const inventory = await character.inventory;
          const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

          if (!inventoryContainer) {
            throw new Error(`Item container ${inventory._id} not found`);
          }

          const addDiffToContainer = await this.characterItemContainer.addItemToContainer(
            item,
            character,
            inventoryContainer._id
          );

          return addDiffToContainer;
        }
      }

      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you don't have any available slots for this item."
      );

      return false;
    }

    equipment[availableSlot] = item;
    await equipment.save();
    await this.characterItemsInventory.deleteItemFromInventory(item.id, character);

    return true;
  }

  public async areAllowedSlotsAvailable(slots: string[], equipment: IEquipment): Promise<boolean> {
    const equipmentSlots = await this.getEquipmentSlots(equipment._id);

    for (const slotData of slots) {
      const slot = camelCase(slotData) as EquipmentSlotTypes;

      if (equipmentSlots[slot] === undefined) {
        return true;
      }

      const equippedItem = equipmentSlots[slot] as unknown as IItem;
      const isStackable = equippedItem.maxStackSize > 1;

      if (!isStackable) {
        return false;
      }

      // stackable items

      if (equippedItem.stackQty === equippedItem.maxStackSize) {
        return false;
      }
    }

    return true;
  }

  public getAvailableSlot(item: IItem, equipmentSet: IEquipmentSet): string {
    let availableSlot = "";
    const itemSlotTypes = this.slots;

    if (!item.allowedEquipSlotType) {
      throw new Error(`Item ${item.key} does not have allowedEquipSlotType`);
    }

    for (const allowedSlotType of item?.allowedEquipSlotType!) {
      const allowedSlotTypeCamelCase = camelCase(allowedSlotType);
      const itemSubTypeCamelCase = camelCase(item.subType);

      const slotType = this.getSlotType(itemSlotTypes, allowedSlotTypeCamelCase, itemSubTypeCamelCase);

      const targetSlot = equipmentSet[slotType];

      if (item.isStackable) {
        // if target slot is empty, just add the stackable item
        if (!targetSlot) {
          availableSlot = slotType;
          break;
        }

        // if not, check if its same key and it we can still stack it
        if (isSameKey(targetSlot?.key, item.key)) {
          if (targetSlot.stackQty! <= targetSlot.maxStackSize) {
            availableSlot = slotType;
            break;
          }
        }

        continue;
      }

      if (targetSlot === undefined) {
        availableSlot = slotType;
        break;
      }
    }

    return availableSlot;
  }

  public async getEquipmentSlots(equipmentId: string): Promise<IEquipmentSet> {
    const equipment = await Equipment.findById(equipmentId).lean().populate(this.slots.join(" ")).exec();

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

    // @ts-ignore
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
    } as IEquipmentSet;
  }

  private getSlotType(itemSlotTypes: string[], slotType: string, subType: string): string {
    if (!itemSlotTypes.includes(slotType)) {
      return subType;
    }
    return slotType;
  }
}
