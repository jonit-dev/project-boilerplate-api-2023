import {
  AnimationEffectKeys,
  EntityAttackType,
  IEquippableStaffBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";

import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemTartarusStaff: IEquippableStaffBlueprint = {
  key: StaffsBlueprint.TartarusStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Poison,
  textureAtlas: "items",
  texturePath: "staffs/tartarus-staff.png",
  name: "Tartarus Staff",
  description:
    "The Tartarus Staff is a weapon of dark power, imbued with the fiery energy of the underworld. Those who wield the Tartarus Staff must be careful, for its power is as dangerous to the wielder as it is to their foes, and it may consume them if they are not strong enough to master its dark magic.",
  weight: 1.7,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 14,
  defense: 5,
  maxRange: RangeTypes.Medium,
  basePrice: 93,
  isTwoHanded: true,
};
