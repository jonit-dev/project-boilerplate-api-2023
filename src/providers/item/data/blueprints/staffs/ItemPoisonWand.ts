import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  IEquippableStaffBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonWand: IEquippableStaffBlueprint = {
  key: StaffsBlueprint.PoisonWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/poison-wand.png",
  name: "Poison Wand",
  description: "A toxic wand or rod imbued with poison, capable of releasing deadly venom and causing injury or death.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 3,
  maxRange: RangeTypes.Short,
  basePrice: 75,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 70,
};
