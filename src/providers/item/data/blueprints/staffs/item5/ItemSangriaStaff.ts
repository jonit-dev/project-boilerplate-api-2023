import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableTwoHandedStaffTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSangriaStaff: IEquippableTwoHandedStaffTier5WeaponBlueprint = {
  key: StaffsBlueprint.SangriaStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  textureAtlas: "items",
  texturePath: "staffs/sangria-staff.png",
  name: "Sangria Staff",
  description:
    "The Sangria staff is a powerful weapon imbued with the essence of blood magic. The staff is made of a purple dark, polished wood with intricate carvings and a single red gemstone set at the top. The gemstone is not just for decoration, but is in fact a potent magic crystal that enhances the wielder's blood magic abilities.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 38,
  defense: 37,
  tier: 5,
  maxRange: RangeTypes.Medium,
  basePrice: 93,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Bleeding],
  entityEffectChance: 80,
};
