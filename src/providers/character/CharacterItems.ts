import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { ItemDrop } from "../item/ItemDrop";

@provide(CharacterItems)
export class CharacterItems {
  constructor(private equipmentSlots: EquipmentSlots, private itemDrop: ItemDrop) {}

  //! Warning: This completely WIPES OUT the item from the inventory or equipment. It DOES NOT DROP IT. Once it's executed, it's gone! If you want to drop an item, check ItemDrop.ts
  public async deleteItem(
    itemId: string,
    character: ICharacter,
    container: "inventory" | "equipment" | "both"
  ): Promise<boolean> {
    switch (container) {
      case "inventory":
        return await this.deleteItemFromInventory(itemId, character);
      case "equipment":
        return await this.deleteItemFromEquipment(itemId, character);
      case "both":
        return (
          (await this.deleteItemFromInventory(itemId, character)) ||
          (await this.deleteItemFromEquipment(itemId, character))
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
        return await this.checkItemInInventory(itemId, character);
      case "equipment":
        return await this.checkItemEquipment(itemId, character);
      case "both":
        return (
          (await this.checkItemInInventory(itemId, character)) || (await this.checkItemEquipment(itemId, character))
        );
      default:
        return false;
    }
  }

  private async deleteItemFromEquipment(itemId: string, character: ICharacter): Promise<boolean> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    if (!item) {
      return false;
    }

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      return false;
    }

    return await this.itemDrop.removeItemFromEquipmentSet(item, character);
  }

  private async deleteItemFromInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const doesCharacterHaveItemInInventory = await this.checkItemInInventory(itemId, character);

    if (!doesCharacterHaveItemInInventory) {
      return false;
    }

    const inventory = await character.inventory;

    const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryItemContainer) {
      return false;
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return false;
    }

    return await this.itemDrop.removeItemFromInventory(item as unknown as IItem, character, inventoryItemContainer._id);
  }

  private async checkItemEquipment(itemId: string, character: ICharacter): Promise<boolean> {
    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      return false;
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(equipment._id);

    for (const [, value] of Object.entries(equipmentSlots)) {
      if (String(value?._id) === String(itemId)) {
        return true;
      }
    }

    return false;
  }

  private async checkItemInInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const inventory = await character.inventory;

    const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryItemContainer) {
      return false;
    }

    const inventoryItemIds = inventoryItemContainer?.itemIds;

    if (!inventoryItemIds) {
      return false;
    }

    return !!inventoryItemIds.find((id) => String(id) === String(itemId));
  }
}
