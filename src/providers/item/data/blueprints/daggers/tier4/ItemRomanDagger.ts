import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRomanDagger: IEquippableMeleeTier4WeaponBlueprint = {
  key: DaggersBlueprint.RomanDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/roman-dagger.png",
  name: "Roman Dagger",
  description: "The Roman Dagger is a lightweight weapon that emphasizes speed and agility.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 35,
  defense: 33,
  tier: 4,
  rangeType: EntityAttackType.Melee,
};
