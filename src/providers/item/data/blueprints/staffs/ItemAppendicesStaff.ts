import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAppendicesStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.AppendicesStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/appendice's-staff.png",
  name: "Appendice's Staff",
  description: "A simple wooden staff used by those learning the basics of magic.",
  attack: 5,
  defense: 2,
  weight: 1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Ranged,
  basePrice: 53,
  maxRange: 4,
  projectileAnimationKey: AnimationEffectKeys.Dark,
};
