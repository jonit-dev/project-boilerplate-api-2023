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

export const itemEmberward: IEquippableStaffBlueprint = {
  key: StaffsBlueprint.Emberward,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  projectileAnimationKey: AnimationEffectKeys.Burn,
  rangeType: EntityAttackType.Ranged,
  maxRange: RangeTypes.Medium,
  textureAtlas: "items",
  texturePath: "staffs/emberward.png",
  name: "Emberward",
  description:
    "The Emberward staff is a powerful weapon that channels the element of fire. At the top of the staff sits a glowing orange gemstone, pulsing with intense heat. With a flick of the wrist, the wielder can unleash torrents of searing fire upon their enemies, leaving a trail of ash and embers in their wake.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 5,
  basePrice: 86,
  isTwoHanded: true,
};
