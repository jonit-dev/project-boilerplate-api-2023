import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IEquipmentSet,
  IItem,
  IItemContainer,
  ItemSlotType,
  ItemSocketEvents,
  ItemType,
  IUIShowMessage,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentRangeUpdate } from "./EquipmentRangeUpdate";
import { EquipmentSlots } from "./EquipmentSlots";

@provide(EquipmentEquip)
export class EquipmentEquip {
  constructor(
    private socketMessaging: SocketMessaging,
    private equipmentHelper: EquipmentRangeUpdate,
    private characterItemInventory: CharacterItemInventory,
    private equipmentSlots: EquipmentSlots,
    private characterValidation: CharacterValidation
  ) {}

  public async equip(character: ICharacter, itemId: string, fromItemContainerId: string): Promise<boolean> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the item to be equipped was not found.");

      return false;
    }

    const itemContainer = await this.getItemContainer(item, fromItemContainerId);

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, equipment not found.");

      return false;
    }

    const isEquipValid = await this.validateEquip(item, character, itemContainer, itemId);

    if (!isEquipValid) {
      return false;
    }

    if (item.isStackable) {
      // check if can stack the item
      const itemStacked = await this.tryAddingItemToStack(character, equipment, item);
      if (itemStacked) {
        // if was stacked, remove the item from the database to avoid garbage
        // also, remove the item from inventory
        await Item.deleteOne({ _id: item._id });
        await this.characterItemInventory.deleteItemFromInventory(itemId, character);

        const inventory = await character.inventory;

        const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

        const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);
        const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
          equipment: equipmentSlots,
          inventory: inventoryContainer,
        };

        this.updateItemInventoryCharacter(payloadUpdate, character);
        return true;
      }
    }

    const availableSlot = this.equipmentSlots.getAvailableSlot(item, equipment as unknown as IEquipmentSet);

    // stackable items are only allowed in accessory slot. So, if cannot stack more,
    // the message will be sended on tryAddingItemToStack function
    if (availableSlot === "" && item.isStackable) {
      return false;
    }

    if (availableSlot === "") {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, no available slot for this item.");
      return false;
    }

    const hasTwoHandedItemEquipped = await this.hasTwoHandedItemEquipped(equipment as unknown as IEquipmentSet);

    if (hasTwoHandedItemEquipped && this.isItemEquippableOnHands(item)) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Sorry, you already have a two-handed item equipped."
      );

      return false;
    }

    if (item.isTwoHanded) {
      const canEquipTwoHanded = await this.checkTwoHandedEquip(equipment as unknown as IEquipmentSet);
      if (!canEquipTwoHanded) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Sorry, you already have an item equipped on your hands."
        );

        return false;
      }
    }

    if (equipment) {
      equipment[availableSlot] = item._id;

      await equipment.save();

      await this.characterItemInventory.deleteItemFromInventory(itemId, character);

      const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);

      const inventory = await character.inventory;

      const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        equipment: equipmentSlots,
        inventory: inventoryContainer,
      };

      this.updateItemInventoryCharacter(payloadUpdate, character);

      await this.equipmentHelper.updateCharacterAttackType(character, item as any);

      return true;
    }

    this.socketMessaging.sendErrorMessageToCharacter(character, "Something went wrong while equipping your item.");

    return false;
  }

  private isItemEquippableOnHands(item: IItem): boolean {
    return !!(
      item.allowedEquipSlotType.includes(ItemSlotType.LeftHand) ||
      item.allowedEquipSlotType.includes(ItemSlotType.RightHand)
    );
  }

  private async checkContainerType(item: IItem, itemContainerId: string): Promise<"inventory" | "npc-body"> {
    const itemContainer = await ItemContainer.findById(itemContainerId);

    if (!itemContainer) {
      throw new Error("Item container not found");
    }

    const parentItem = await Item.findById(itemContainer.parentItem);

    if (!parentItem) {
      throw new Error("Parent item not found");
    }

    // match -body on parentItem.key
    const isBody = parentItem.key.match(/-body$/);

    return isBody ? "npc-body" : "inventory";
  }

  private async getItemContainer(item: IItem, itemContainerId: string): Promise<IItemContainer> {
    if (item.isItemContainer && itemContainerId === "") {
      return (await ItemContainer.findById(item.itemContainer)) as unknown as IItemContainer;
    }

    const itemContainer = (await ItemContainer.findById(itemContainerId)) as unknown as IItemContainer;

    return itemContainer;
  }

  private async validateEquip(
    item: IItem,
    character: ICharacter,
    itemContainer: IItemContainer,
    itemId: string
  ): Promise<boolean> {
    const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the item to be equipped was not found.");
      return false;
    }

    if (!itemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, the item container was not found.");

      return false;
    }

    const isSourceContainerNPCBody = (await this.checkContainerType(item, itemContainer._id)) === "npc-body";

    if (!isSourceContainerNPCBody) {
      const hasItemOnInventory = await this.characterItemInventory.checkItemInInventory(itemId, character);

      if (!hasItemOnInventory) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you don't have this item.");

        return false;
      }
    }

    return true;
  }

  private async hasTwoHandedItemEquipped(equipment: IEquipmentSet): Promise<boolean> {
    const leftHandItem = await Item.findById(equipment.leftHand);
    const rightHandItem = await Item.findById(equipment.rightHand);

    if (leftHandItem?.isTwoHanded || rightHandItem?.isTwoHanded) {
      return true;
    }
    return false;
  }

  private async checkTwoHandedEquip(equipment: IEquipmentSet): Promise<boolean> {
    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);
    if (!equipmentSlots.leftHand && !equipmentSlots.rightHand) return true;

    return false;
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

  public getAllowedItemTypes(): ItemType[] {
    const allowedItemTypes: ItemType[] = [];

    for (const allowedItemType of Object.keys(ItemType)) {
      allowedItemTypes.push(ItemType[allowedItemType]);
    }

    return allowedItemTypes;
  }

  private async tryAddingItemToStack(
    character: ICharacter,
    equipment: IEquipment,
    selectedItem: IItem
  ): Promise<boolean> {
    // only accessory slot can have stackable items
    if (!selectedItem.allowedEquipSlotType.includes(ItemSlotType.Accessory)) {
      return false;
    }

    const accessoryItem = await Item.findById(equipment.accessory);

    if (accessoryItem) {
      if (!accessoryItem.isStackable) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Accessory slot is not empty!",
          type: "error",
        });
        return false;
      }

      if (accessoryItem.key.replace(/-\d+$/, "") === selectedItem.key.replace(/-\d+$/, "")) {
        if (selectedItem.stackQty) {
          const updatedStackQty = accessoryItem.stackQty! + selectedItem.stackQty;

          if (updatedStackQty > accessoryItem.maxStackSize) {
            this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
              message: `Sorry, you cannot stack more than ${accessoryItem.maxStackSize} ${accessoryItem.key}s.`,
              type: "error",
            });
            return false;
          }

          await Item.updateOne(
            {
              _id: accessoryItem._id,
            },
            { $set: { stackQty: updatedStackQty } }
          );

          return true;
        }
      }
    }
    return false;
  }
}
