import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { IEquippableRangedTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHadesBow: IEquippableRangedTier4WeaponBlueprint = {
  key: RangedWeaponsBlueprint.HadesBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/hades-bow.png",
  name: "Hades Bow",
  description: "A bow infused with dark energy.",
  attack: 30,
  tier: 4,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
  ],
  isTwoHanded: true,
  basePrice: 125,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 90,
};
