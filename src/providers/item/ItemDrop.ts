import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  IItem,
  IItemContainer,
  IItemDrop,
  ItemSocketEvents,
  IUIShowMessage,
  UIMessageType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemDrop)
export class ItemDrop {
  constructor(private socketMessaging: SocketMessaging, private characterWeight: CharacterWeight) {}

  public async performItemDrop(itemDrop: IItemDrop, character: ICharacter): Promise<boolean> {
    const isDropValid = await this.isItemDropValid(itemDrop, character);

    if (!isDropValid) {
      return false;
    }

    const dropItem = await Item.findById(itemDrop.itemId);

    if (dropItem) {
      let isItemRemoved = false;

      if (itemDrop.fromEquipmentSet) {
        isItemRemoved = await this.removeItemFromEquipmentSet(dropItem as unknown as IItem, character);
      } else {
        isItemRemoved = await this.removeItemFromInventory(
          dropItem as unknown as IItem,
          character,
          itemDrop.fromContainerId
        );
      }

      if (!isItemRemoved) {
        return false;
      }

      try {
        await this.characterWeight.updateCharacterWeight(character);

        const equipmentSlots = await this.getEquipmentSlots(character.equipment?.toString());

        let inventory = {} as IItemContainer;
        if (!itemDrop.fromEquipmentSet) {
          const updatedContainer = (await ItemContainer.findById(
            itemDrop.fromContainerId
          )) as unknown as IItemContainer;
          inventory = {
            _id: updatedContainer._id,
            parentItem: updatedContainer!.parentItem.toString(),
            owner: updatedContainer?.owner?.toString() || character.name,
            name: updatedContainer?.name,
            slotQty: updatedContainer!.slotQty,
            slots: updatedContainer?.slots,
            // allowedItemTypes: this.getAllowedItemTypes(),
            isEmpty: updatedContainer!.isEmpty,
          };
        }

        const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
          equipment: equipmentSlots,
          inventory: inventory,
        };

        // if itemDrop toPosition has x and y, then drop item to that position in the map
        await Item.updateOne(
          {
            _id: dropItem._id,
          },
          {
            x: itemDrop.x,
            y: itemDrop.y,
            scene: itemDrop.scene,
          }
        );

        this.updateInventoryCharacter(payloadUpdate, character);

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    return false;
  }

  private async removeItemFromEquipmentSet(item: IItem, character: ICharacter): Promise<boolean> {
    const equipmentSetId = character.equipment;
    const equipmentSet = await Equipment.findById(equipmentSetId);

    if (!equipmentSet) {
      this.sendCustomErrorMessage(character, "Sorry, equipment set not found.");
      return false;
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
      if (equipmentSet[itemSlotType] && equipmentSet[itemSlotType].toString() === item._id.toString()) {
        targetSlot = itemSlotType;
      }
    }

    equipmentSet[targetSlot] = undefined;

    await equipmentSet.save();

    return true;
  }

  /**
   * This method will remove a item from the character inventory
   */
  private async removeItemFromInventory(item: IItem, character: ICharacter, fromContainerId: string): Promise<boolean> {
    const targetContainer = await ItemContainer.findById(fromContainerId);

    if (!item) {
      console.log("dropItemFromInventory: Item not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    if (!targetContainer) {
      console.log("dropItemFromInventory: Character container not found");
      this.sendGenericErrorMessage(character);
      return false;
    }

    for (let i = 0; i < targetContainer.slotQty; i++) {
      const slotItem = targetContainer.slots?.[i];

      if (!slotItem) continue;
      if (slotItem.key === item.key) {
        // Changing item slot to null, thus removing it
        targetContainer.slots[i] = null;

        await ItemContainer.updateOne(
          {
            _id: targetContainer._id,
          },
          {
            $set: {
              slots: {
                ...targetContainer.slots,
              },
            },
          }
        );

        return true;
      }
    }

    return false;
  }

  private async isItemDropValid(itemDrop: IItemDrop, character: ICharacter): Promise<Boolean> {
    const item = await Item.findById(itemDrop.itemId);
    const isFromEquipmentSet = itemDrop.fromEquipmentSet;

    if (!item) {
      this.sendCustomErrorMessage(character, "Sorry, this item is not accessible.");
      return false;
    }

    if (!isFromEquipmentSet) {
      const validation = await this.validateItemDropFromInventory(itemDrop, item as unknown as IItem, character);

      if (!validation) {
        return false;
      }
    }

    if (character.isBanned) {
      this.sendCustomErrorMessage(character, "Sorry, you are banned and can't drop this item.");
      return false;
    }

    if (!character.isOnline) {
      this.sendCustomErrorMessage(character, "Sorry, you must be online to drop this item.");
      return false;
    }

    return true;
  }

  private async validateItemDropFromInventory(
    itemDrop: IItemDrop,
    item: IItem,
    character: ICharacter
  ): Promise<boolean> {
    const inventory = await character.inventory;

    if (!inventory) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to drop this item.");
      return false;
    }

    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      this.sendCustomErrorMessage(character, "Sorry, inventory container not found.");
      return false;
    }

    const hasItemInInventory = inventoryContainer?.itemIds?.find(
      (itemId) => String(itemId) === String(itemDrop.itemId)
    );

    if (!hasItemInInventory) {
      this.sendCustomErrorMessage(character, "Sorry, you do not have this item in your inventory.");
      return false;
    }

    if (itemDrop.fromContainerId.toString() !== inventoryContainer?.id.toString()) {
      this.sendCustomErrorMessage(character, "Sorry, this item does not belong to your inventory.");
      return false;
    }

    if (!inventoryContainer) {
      this.sendCustomErrorMessage(character, "Sorry, you must have a bag or backpack to drop this item.");
      return false;
    }

    return true;
  }

  private updateInventoryCharacter(payloadUpdate: IEquipmentAndInventoryUpdatePayload, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }

  public sendGenericErrorMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "Sorry, failed to drop your item from your inventory.",
      type: "error",
    });
  }

  public sendCustomErrorMessage(character: ICharacter, message: string, type: UIMessageType = "error"): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message,
      type,
    });
  }

  public async getEquipmentSlots(equipmentId: string | undefined): Promise<IEquipmentSet> {
    if (equipmentId === undefined) {
      return {} as IEquipmentSet;
    }

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
}
