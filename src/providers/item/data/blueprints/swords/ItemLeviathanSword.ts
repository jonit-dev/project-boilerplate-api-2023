import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeviathanSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.LeviathanSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/leviathan-sword.png",
  name: "Leviathan Sword",
  description:
    "A mythical sword associated with the leviathan, a sea monster of enormous size and power. It is imbued with the strength and ferocity of the leviathan.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 25,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
