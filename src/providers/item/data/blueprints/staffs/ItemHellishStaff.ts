import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHellishStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.HellishStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/hellish-staff.png",
  name: "Hellish Staff",
  description:
    "The Hellish Staff is primarily an offensive weapon, with a high Attack rating that allows mages to unleash devastating spells and incantations upon their enemies.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 0,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  isTwoHanded: true,
  maxRange: 8,
};
