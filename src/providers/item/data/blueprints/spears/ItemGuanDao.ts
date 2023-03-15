import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGuanDao: IEquippableWeaponBlueprint = {
  key: SpearsBlueprint.GuanDao,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/guan-dao.png",
  name: "Guan Dao",
  description:
    "A traditional Chinese spear with a long, curved blade mounted on a pole, used by both infantry and cavalry. It is a powerful weapon that can deliver powerful sweeping and thrusting attacks.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 5,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
