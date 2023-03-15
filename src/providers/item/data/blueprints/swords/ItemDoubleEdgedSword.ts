import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDoubleEdgedSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.DoubleEdgedSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/double-edged-sword.png",
  name: "Double Edged Sword",
  description: "A sword with sharp edges on both sides of the blade, allowing for versatile and deadly attacks.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 16,
  defense: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 86,
};
