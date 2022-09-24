import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { provide } from "inversify-binding-decorators";

@provide(CharacterItems)
export class CharacterItems {
  constructor(private equipmentSlots: EquipmentSlots) {}

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
