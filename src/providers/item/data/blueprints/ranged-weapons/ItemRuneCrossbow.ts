import {
  EntityAttackType,
  IEquippableRangedWeaponTwoHandedBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { RangeTypes } from "../../types/RangedWeaponTypes";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRuneCrossbow: IEquippableRangedWeaponTwoHandedBlueprint = {
  key: RangedWeaponsBlueprint.RuneCrossbow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/rune-crossbow.png",
  name: "Rune Crossbow",
  description: "A crossbow with rune inscriptions that increases attack speed and accuracy.",
  attack: 20,
  defense: 10,
  weight: 7,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Bolt,
    RangedWeaponsBlueprint.ElvenBolt,
    RangedWeaponsBlueprint.CorruptionBolt,
    RangedWeaponsBlueprint.FireBolt,
  ],
  isTwoHanded: true,
  basePrice: 100,
};
