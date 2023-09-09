import { IEquippableRangedTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDragonWingBow: IEquippableRangedTier10WeaponBlueprint = {
  key: RangedWeaponsBlueprint.DragonWingBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/dragon-wing-bow.png",
  name: "Dragon Wing Bow",
  description:
    "Made from the scales and wing membrane of a dragon. Shoots arrows that cause small, fiery explosions on impact.",
  attack: 78,
  weight: 1,
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

    RangedWeaponsBlueprint.HeartseekerArrow,
  ],
  tier: 10,
  isTwoHanded: true,
  basePrice: 200,
};
