import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWindCutterSword: IEquippableMeleeTier7WeaponBlueprint = {
  key: SwordsBlueprint.WindCutterSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/wind-cutter-sword.png",
  name: "Wind Cutter Sword ",
  description: "A lightweight sword that grants incredible agility and speed to its wielder.",
  attack: 56,
  defense: 52,
  tier: 7,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 140,
};
