import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { IEquippableRangedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemZephyrusBow: IEquippableRangedTier5WeaponBlueprint = {
  key: RangedWeaponsBlueprint.ZephyrusBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/zephyrus-bow.png",
  name: "Zephyrus Bow",
  description: "A bow that shoots arrows infused with wind.",
  attack: 38,
  tier: 5,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
    RangedWeaponsBlueprint.GoldenArrow,
  ],
  isTwoHanded: true,
  basePrice: 120,
};
