import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  EntityAttackType,
  IEquippableRangedWeaponTwoHandedBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemValkyriesBow: IEquippableRangedWeaponTwoHandedBlueprint = {
  key: RangedWeaponsBlueprint.ValkyriesBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/valkyries-bow.png",
  name: "Valkyries Bow",
  description: "A bow that fires arrows that seek out enemies and deal heavy damage on impact.",
  attack: 38,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.GoldenArrow,
    RangedWeaponsBlueprint.ShockArrow,
    RangedWeaponsBlueprint.PoisonArrow,
  ],
  isTwoHanded: true,
  basePrice: 160,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 90,
};
