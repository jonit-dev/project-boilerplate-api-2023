import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.FireStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
  textureAtlas: "items",
  texturePath: "staffs/fire-staff.png",
  name: "Fire Staff",
  description:
    "A staff imbued with the power of flames, adorned with a glowing fire ember gem at its peak. It is capable of unleashing fiery attacks and generating intense heat.",
  attack: 15,
  defense: 8,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 77,
  maxRange: 7,
};
