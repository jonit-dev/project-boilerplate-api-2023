import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { CharacterClass, ItemSubType, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(BerserkerPassiveHabilities)
export class BerserkerPassiveHabilities {
  constructor(private equipmentSlots: EquipmentSlots) {}

  public async berserkerWeaponHandler(characterId: Types.ObjectId, itemId: Types.ObjectId): Promise<boolean> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;

    if (character.class !== CharacterClass.Berserker) {
      return false;
    }

    const itemToBeEquipped = (await Item.findById(itemId).lean()) as IItem;

    if (itemToBeEquipped.type !== ItemType.Weapon) {
      return true;
    }

    const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment as string);
    const leftHandItem = (await Item.findById(equipmentSlots.leftHand).lean()) as IItem;
    const rightHandItem = (await Item.findById(equipmentSlots.rightHand).lean()) as IItem;

    if (!rightHandItem && !leftHandItem) {
      return true;
    }

    if (
      (leftHandItem?.subType === ItemSubType.Sword &&
        itemToBeEquipped.subType === ItemSubType.Sword &&
        !rightHandItem) ||
      (rightHandItem?.subType === ItemSubType.Sword && itemToBeEquipped.subType === ItemSubType.Sword && !leftHandItem)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
