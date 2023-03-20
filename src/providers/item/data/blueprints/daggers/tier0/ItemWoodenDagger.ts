import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { DaggersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWoodenDagger: IEquippableMeleeTier0WeaponBlueprint = {
  key: DaggersBlueprint.WoodenDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/wooden-dagger.png",
  name: "Training Dagger",
  description: "A short-bladed weapon with a sharp point used for stabbing, thrusting, or throwing.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 1,
  defense: 1,
  tier: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 14,
  isTraining: true,
};
