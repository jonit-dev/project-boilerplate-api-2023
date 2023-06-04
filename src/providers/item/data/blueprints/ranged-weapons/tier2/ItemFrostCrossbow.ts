import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

import { IEquippableRangedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";

export const itemFrostCrossbow: IEquippableRangedTier2WeaponBlueprint = {
  key: RangedWeaponsBlueprint.FrostCrossbow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/frost-crossbow.png",
  name: "Frost Crossbow",
  description: "The Ice Crossbow is a two-handed crossbow-type ranged weapon.",
  weight: 3,
  attack: 20,
  tier: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Bolt, RangedWeaponsBlueprint.ElvenBolt],
  isTwoHanded: true,
  basePrice: 93,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 90,
};
