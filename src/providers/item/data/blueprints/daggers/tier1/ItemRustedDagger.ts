import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRustedDagger: IEquippableMeleeTier1WeaponBlueprint = {
  key: DaggersBlueprint.RustedDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/rusted-dagger.png",
  name: "Rusted Dagger",
  description:
    "The Rusty Dagger is a small and lightweight weapon with a blade that has seen better days. The blade is dull and rusted, making it less effective than it once was. Despite its age and condition, the Rusty Dagger can still be a deadly weapon in the right hands.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 14,
  defense: 12,
  tier: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 39,
};