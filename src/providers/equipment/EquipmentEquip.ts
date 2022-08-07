import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
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

  public async equip(character: ICharacter, itemId: string): Promise<void> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    const inventory = (await character.inventory) as unknown as IItem;

    const itemContainer = (await ItemContainer.findOne({
      owner: character.id,
    })) as IItemContainer;

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      return;
    }

    const isEquipValid = this.validateEquip(item, character, itemContainer, inventory, itemId);

    if (!isEquipValid) {
      return;
    }

    const availableSlot = this.getAvailableSlot(item, equipment as unknown as IEquipmentSet, itemContainer);

    if (availableSlot === "") {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "There aren't slots available.",
        type: "error",
      });
      return;
    }

    if (equipment) {
      equipment[availableSlot] = await this.getItemId(item as unknown as IItem);
      await equipment.save();

      await this.removeItemFromInventory(itemId, itemContainer!);

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
  }

  private validateEquip(
    item: IItem,
    character: ICharacter,
    itemContainer: IItemContainer,
    inventory: IItem,
    itemId: string
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

    if (!inventory) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Inventory is empty.",
        type: "error",
      });
      return false;
    }

    let userHasItem = false;
    for (const slot in itemContainer.slots) {
      if (itemContainer.slots[slot] && itemContainer.slots[slot]._id.toString() === itemId.toString()) {
        userHasItem = true;
        break;
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

  public getAvailableSlot(item: IItem, equipment: IEquipmentSet, itemContainer: IItemContainer): string {
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
      if (equipment[allowedSlotTypeCamelCase] === undefined) {
        if (!itemSlotTypes.includes(allowedSlotTypeCamelCase)) {
          const itemTypeCamelCase = this.getWordCamelCase(item.type);
          availableSlot = itemTypeCamelCase;
        } else {
          availableSlot = allowedSlotTypeCamelCase;
        }
        break;
      }
    }

    return availableSlot;
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

  public async getItemId(item: IItem): Promise<string> {
    const blueprintData = itemsBlueprintIndex[item.textureKey];
    let newItem = new Item({
      ...blueprintData,
      owner: item.owner,
    });

    newItem = await newItem.save();

    await Item.remove({ _id: item._id });

    return newItem._id;
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
