import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonWand: Partial<IMagicStaff> = {
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
  maxRange: 5,
  basePrice: 75,
  isTwoHanded: true,
};
