import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableRangedTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBloodseekerBow: IEquippableRangedTier9WeaponBlueprint = {
  key: RangedWeaponsBlueprint.BloodseekerBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/bloodseeker-bow.png",
  name: "Bloodseeker Bow",
  description:
    "Crafted from the bone of a fallen demon. Drains the life force of enemies hit, partially healing the archer.",
  attack: 70,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
    RangedWeaponsBlueprint.GoldenArrow,
    RangedWeaponsBlueprint.EmeraldArrow,
    RangedWeaponsBlueprint.CrimsonArrow,
    RangedWeaponsBlueprint.WardenArrow,
    RangedWeaponsBlueprint.SunflareArrow,
    RangedWeaponsBlueprint.EarthArrow,
    RangedWeaponsBlueprint.SilvermoonArrow,
  ],
  entityEffects: [EntityEffectBlueprint.Bleeding],
  entityEffectChance: 90,
  tier: 9,
  isTwoHanded: true,
  basePrice: 190,
};
