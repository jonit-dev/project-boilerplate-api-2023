import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.CorruptionStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/corruption-staff.png",
  name: "Corruption Staff",
  description: "A shriveled staff of corruption.",
  attack: 8,
  defense: 3,
  weight: 1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Ranged,
  basePrice: 69,
  maxRange: 6,
  projectileAnimationKey: AnimationEffectKeys.Green,
};
