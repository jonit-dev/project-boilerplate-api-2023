import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  IItem,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(EquipmentEquip)
export class EquipmentEquip {
  constructor(private socketMessaging: SocketMessaging) {}

  public async equip(character: ICharacter, itemId: string, itemContainerId: string): Promise<void> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    const equipItemContainer = this.checkIfEquipItemContainer(item, itemContainerId);
    const itemContainer = await this.getItemContainer(item, itemContainerId);

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      return;
    }

    const isEquipValid = this.validateEquip(item, character, itemContainer, itemId, equipItemContainer);

    if (!isEquipValid) {
      return;
    }

    const availableSlot = this.getAvailableSlot(item, equipment as unknown as IEquipmentSet);

    if (availableSlot === "") {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "There aren't slots available.",
        type: "error",
      });
      return;
    }

    // @ts-ignore
    if (item.isTwoHanded) {
      const canEquipTwoHanded = await this.checkTwoHandedEquip(equipment as unknown as IEquipmentSet);
      if (!canEquipTwoHanded) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Cannot equip two handed item, hand slot already have an item!",
          type: "error",
        });
        return;
      }
    }

    if (equipment) {
      equipment[availableSlot] = item._id;

      await equipment.save();

      await this.removeItemFromInventory(itemId, itemContainer!);

      const equipmentSlots = await this.getEquipmentSlots(equipment._id);

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
  }

  private checkIfEquipItemContainer(item: IItem, itemContainerId: string): boolean {
    if (item.isItemContainer && itemContainerId === "") {
      return true;
    }
    return false;
  }

  private async getItemContainer(item: IItem, itemContainerId: string): Promise<IItemContainer> {
    if (item.isItemContainer && itemContainerId === "") {
      return (await ItemContainer.findById(item.itemContainer)) as IItemContainer;
    }

    const itemContainer = (await ItemContainer.findById(itemContainerId)) as IItemContainer;

    return itemContainer;
  }

  private validateEquip(
    item: IItem,
    character: ICharacter,
    itemContainer: IItemContainer,
    itemId: string,
    equipItemContainer: boolean
  ): boolean {
    if (!item) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Item not found.",
        type: "error",
      });
      return false;
    }

    if (!itemContainer) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Container not found.",
        type: "error",
      });
      return false;
    }

    let userHasItem = equipItemContainer || false;

    if (!equipItemContainer) {
      for (const slot in itemContainer.slots) {
        if (itemContainer.slots[slot] && itemContainer.slots[slot]._id.toString() === itemId.toString()) {
          userHasItem = true;
          break;
        }
      }
    }

    if (!userHasItem) {
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

    return true;
  }

  private async checkTwoHandedEquip(equipment: IEquipmentSet): Promise<boolean> {
    const equipmentSlots = await this.getEquipmentSlots(equipment._id);
    if (!equipmentSlots.leftHand && !equipmentSlots.rightHand) return true;

    return false;
  }

  public getAvailableSlot(item: IItem, equipment: IEquipmentSet): string {
    let availableSlot = "";
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

    for (const allowedSlotType of item?.allowedEquipSlotType) {
      const allowedSlotTypeCamelCase = this.getWordCamelCase(allowedSlotType);
      const itemSubTypeCamelCase = this.getWordCamelCase(item.subType);

      const slotType = this.getSlotType(itemSlotTypes, allowedSlotTypeCamelCase, itemSubTypeCamelCase);

      if (equipment[slotType] === undefined) {
        availableSlot = slotType;
        break;
      }
    }

    return availableSlot;
  }

  private getSlotType(itemSlotTypes: string[], slotType: string, subType: string): string {
    if (!itemSlotTypes.includes(slotType)) {
      return subType;
    }
    return slotType;
  }

  public getWordCamelCase(word: string): string {
    return word.charAt(0).toLowerCase() + word.slice(1);
  }

  public updateItemInventoryCharacter(
    equipmentAndInventoryUpdate: IEquipmentAndInventoryUpdatePayload,
    character: ICharacter
  ): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      equipmentAndInventoryUpdate
    );
  }

  public async getEquipmentSlots(equipmentId: string): Promise<IEquipmentSet> {
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
      if (itemContainer.slots[slot] && itemContainer.slots[slot]._id.toString() === itemId.toString()) {
        slot = "";
        break;
      }
      index++;
    }

    itemContainer.slots[index] = null;
    itemContainer.markModified("slots");
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
