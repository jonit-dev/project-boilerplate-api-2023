import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { IEquippableRangedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLongBow: IEquippableRangedTier2WeaponBlueprint = {
  key: RangedWeaponsBlueprint.LongBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/long-bow.png",
  name: "Long Bow",
  description:
    "A tall, traditional bow with a long, narrow limb and a long string. It is known for its ability to shoot arrows with great speed and distance.",
  attack: 17,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow, RangedWeaponsBlueprint.FrostArrow],
  isTwoHanded: true,
  basePrice: 70,
};
