import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFalconsSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.FalconsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/falcons-sword.png",
  name: "Falcon's Sword",
  description:
    "The Falcon's Sword is a graceful and deadly weapon often used by knights and other chivalrous warriors who embody the virtues of bravery and honor.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 8,
  rangeType: EntityAttackType.Melee,
};
