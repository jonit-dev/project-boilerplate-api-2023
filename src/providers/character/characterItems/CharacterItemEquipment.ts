import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";

import { provide } from "inversify-binding-decorators";

@provide(CharacterItemEquipment)
export class CharacterItemEquipment {
  constructor(private equipmentSlots: EquipmentSlots) {}

  public async deleteItemFromEquipment(itemId: string, character: ICharacter): Promise<boolean> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    if (!item) {
      return false;
    }

    const equipment = await Equipment.findById(character.equipment);

    if (!equipment) {
      return false;
    }

    return await this.removeItemFromEquipmentSet(item, character);
  }

  public async checkItemEquipment(itemId: string, character: ICharacter): Promise<boolean> {
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

  private async removeItemFromEquipmentSet(item: IItem, character: ICharacter): Promise<boolean> {
    const equipmentSetId = character.equipment;
    const equipmentSet = await Equipment.findById(equipmentSetId);

    if (!equipmentSet) {
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
}
