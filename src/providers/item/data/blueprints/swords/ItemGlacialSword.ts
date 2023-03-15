import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGlacialSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.GlacialSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/glacial-sword.png",
  name: "Glacial Sword",
  description:
    "The Glacial Sword is a formidable and awe-inspiring weapon often used by warriors who hail from the icy northern regions of the world",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 8,
  rangeType: EntityAttackType.Melee,
};
