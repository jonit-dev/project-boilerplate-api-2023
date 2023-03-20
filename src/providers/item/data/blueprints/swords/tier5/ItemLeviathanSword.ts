import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLeviathanSword: IEquippableMeleeTier5WeaponBlueprint = {
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
  attack: 40,
  defense: 40,
  tier: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
