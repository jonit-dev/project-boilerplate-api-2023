import { IEquippableRangedTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWhisperWindBow: IEquippableRangedTier6WeaponBlueprint = {
  key: RangedWeaponsBlueprint.WhisperWindBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/whisper-wind-bow.png",
  name: "Whisper Wind Bow",
  description:
    "Crafted from ghostwood, this bow is nearly silent. Ideal for assassins, it allows for stealthy eliminations.",
  attack: 50,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
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
  ],
  tier: 6,
  isTwoHanded: true,
  basePrice: 172,
};
