import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHellishBronzeStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.HellishBronzeStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/hellish-bronze-staff.png",
  name: "Hellish Bronze Staff",
  description:
    "The Hellish Bronze Staff is primarily a defensive weapon, with a high Defense rating that allows mages to deflect and absorb incoming attacks.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 0,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  isTwoHanded: true,
  maxRange: 7,
};
