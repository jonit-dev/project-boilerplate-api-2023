import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { CharacterClass, ItemSubType, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(RoguePassiveHabilities)
export class RoguePassiveHabilities {
  constructor(private equipmentSlots: EquipmentSlots, private characterRepository: CharacterRepository) {}

  public async rogueWeaponHandler(characterId: Types.ObjectId, itemId: Types.ObjectId): Promise<boolean> {
    const character = (await this.characterRepository.findById(characterId.toString(), {
      leanType: "lean",
    })) as ICharacter;

    if (character.class !== CharacterClass.Rogue) {
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
      (leftHandItem?.subType === ItemSubType.Dagger &&
        itemToBeEquipped.subType === ItemSubType.Dagger &&
        !rightHandItem) ||
      (rightHandItem?.subType === ItemSubType.Dagger &&
        itemToBeEquipped.subType === ItemSubType.Dagger &&
        !leftHandItem)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
