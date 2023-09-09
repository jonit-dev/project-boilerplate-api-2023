import { IEquippableMeleeTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBronzeFistMace: IEquippableMeleeTier6WeaponBlueprint = {
  key: MacesBlueprint.BronzeFistMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/bronze-fist-mace.png",
  name: "Bronze Fist Mace",
  description:
    "A simple, yet effective, bronze mace designed for pure power. It is an enduring weapon, rarely showing signs of wear.",
  weight: 3.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 48,
  defense: 28,
  tier: 6,
  rangeType: EntityAttackType.Melee,
};
