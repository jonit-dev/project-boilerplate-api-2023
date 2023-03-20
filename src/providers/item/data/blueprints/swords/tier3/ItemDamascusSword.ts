import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDamascusSword: IEquippableMeleeTier3WeaponBlueprint = {
  key: SwordsBlueprint.DamascusSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/damascus-sword.png",
  name: "Damascus Sword",
  description:
    "A beautiful and exceptionally strong sword crafted from Damascus steel, prized for its intricate patterns and durability.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 26,
  defense: 23,
  tier: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 85,
};
