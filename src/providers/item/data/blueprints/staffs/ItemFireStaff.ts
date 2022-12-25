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
  description: "A staff with an fire ember gem at the top.",
  attack: 9,
  defense: 4,
  weight: 1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Ranged,
  basePrice: 77,
  maxRange: 7,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
};
