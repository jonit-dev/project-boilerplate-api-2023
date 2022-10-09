import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { EquipmentEquip } from "@providers/equipment/EquipmentEquip";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

import { provide } from "inversify-binding-decorators";
import { CharacterItemEquipment } from "./CharacterItemEquipment";
import { CharacterItemInventory } from "./CharacterItemInventory";
import { CharacterItemSlots } from "./CharacterItemSlots";
import { CharacterItemStack } from "./CharacterItemStack";

@provide(CharacterItems)
export class CharacterItems {
  constructor(
    private characterItemInventory: CharacterItemInventory,
    private characterItemEquipment: CharacterItemEquipment,
    private socketMessaging: SocketMessaging,
    private equipmentEquip: EquipmentEquip,
    private characterItemStack: CharacterItemStack,
    private characterItemSlots: CharacterItemSlots
  ) {}

  //! Warning: This completely WIPES OUT the item from the inventory or equipment. It DOES NOT DROP IT. Once it's executed, it's gone! If you want to drop an item, check ItemDrop.ts
  public async deleteItemFromContainer(
    itemId: string,
    character: ICharacter,
    container: "inventory" | "equipment" | "both"
  ): Promise<boolean> {
    switch (container) {
      case "inventory":
        return await this.characterItemInventory.deleteItemFromInventory(itemId, character);
      case "equipment":
        return await this.characterItemEquipment.deleteItemFromEquipment(itemId, character);
      case "both":
        return (
          (await this.characterItemInventory.deleteItemFromInventory(itemId, character)) ||
          (await this.characterItemEquipment.deleteItemFromEquipment(itemId, character))
        );
      default:
        return false;
    }
  }

  public async hasItem(
    itemId: string,
    character: ICharacter,
    container: "inventory" | "equipment" | "both"
  ): Promise<boolean> {
    switch (container) {
      case "inventory":
        return await this.characterItemInventory.checkItemInInventory(itemId, character);
      case "equipment":
        return await this.characterItemEquipment.checkItemEquipment(itemId, character);
      case "both":
        return (
          (await this.characterItemInventory.checkItemInInventory(itemId, character)) ||
          (await this.characterItemEquipment.checkItemEquipment(itemId, character))
        );
      default:
        return false;
    }
  }

  public async addItemToContainer(
    item: IItem,
    character: ICharacter,
    toContainerId: string,
    isContainerEquipment?: boolean
  ): Promise<boolean> {
    const itemToBeAdded = (await Item.findById(item.id)) as unknown as IItem;

    if (!itemToBeAdded) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be added was not found.");
      return false;
    }

    if (isContainerEquipment) {
      await this.equipmentEquip.equip(character, item.id, "");

      return true;
    }

    const targetContainer = (await ItemContainer.findById(toContainerId)) as unknown as IItemContainer;

    if (!targetContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The target container was not found.");
      return false;
    }

    if (targetContainer) {
      let isNewItem = true;

      // Item Type is valid to add to a container?
      const isItemTypeValid = targetContainer.allowedItemTypes?.filter((entry) => {
        return entry === itemToBeAdded?.type;
      });
      if (!isItemTypeValid) {
        this.socketMessaging.sendErrorMessageToCharacter(
          character,
          "Oops! The item type is not valid for this container."
        );
        return false;
      }

      // Inventory is empty, slot checking not needed
      if (targetContainer.isEmpty) isNewItem = true;

      if (itemToBeAdded.isStackable) {
        const wasStacked = await this.characterItemStack.tryAddingItemToStack(
          character,
          targetContainer,
          itemToBeAdded
        );

        if (wasStacked) {
          return true;
        } else {
          isNewItem = true;
        }
      }

      // Check's done, need to create new item on char inventory
      if (isNewItem) {
        const result = await this.characterItemSlots.addItemOnFirstAvailableSlot(
          character,
          itemToBeAdded,
          targetContainer
        );

        if (!result) {
          return false;
        }
      }

      return true;
    }

    return false;
  }
}
