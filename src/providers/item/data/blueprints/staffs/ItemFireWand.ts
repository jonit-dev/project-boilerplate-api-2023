import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.FireWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  textureAtlas: "items",
  texturePath: "staffs/fire-wand.png",
  name: "Fire Wand",
  description:
    "A wand or staff imbued with the power of flames, capable of generating and controlling intense heat and fire.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 3,
  maxRange: 4,
  basePrice: 60,
};
