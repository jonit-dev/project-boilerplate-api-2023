import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.FireStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/fire-staff.png",
  name: "Fire Staff",
  description:
    "A staff imbued with the power of flames, adorned with a glowing fire ember gem at its peak. It is capable of unleashing fiery attacks and generating intense heat.",
  attack: 8,
  defense: 5,
  weight: 1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Ranged,
  basePrice: 77,
  maxRange: 7,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
};
