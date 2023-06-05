import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { IEquippableRangedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLightningCrossbow: IEquippableRangedTier3WeaponBlueprint = {
  key: RangedWeaponsBlueprint.LightningCrossbow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/lightning-crossbow.png",
  name: "Lightning Crossbow",
  description: "A crossbow that fires bolts of lightning, dealing heavy damage to enemies weak to lightning.",
  attack: 25,
  tier: 3,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Bolt, RangedWeaponsBlueprint.ElvenBolt, RangedWeaponsBlueprint.FireBolt],
  isTwoHanded: true,
  basePrice: 95,
};
