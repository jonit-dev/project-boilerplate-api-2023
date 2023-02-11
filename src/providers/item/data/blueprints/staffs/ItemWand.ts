import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.Wand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/wand.png",
  name: "Wand",
  description:
    "A powerful magic wand crafted by the dark lord Sauron himself, imbued with malevolent energy and deadly magical power.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 1,
  maxRange: 4,
  basePrice: 50,
  isTwoHanded: true,
};
