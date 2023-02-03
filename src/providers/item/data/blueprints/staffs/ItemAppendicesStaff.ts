import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAppendicesStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.AppendicesStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/appendice's-staff.png",
  name: "Appendice's Staff",
  description:
    "A basic wooden staff used by novice mages learning the fundamentals of magic. It is a simple yet reliable tool for channeling magical energy.",
  attack: 7,
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Ranged,
  basePrice: 60,
  maxRange: 4,
  projectileAnimationKey: AnimationEffectKeys.Dark,
};
