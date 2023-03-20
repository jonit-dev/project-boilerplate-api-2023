import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { IEquippableRangedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemElmReflexBow: IEquippableRangedTier3WeaponBlueprint = {
  key: RangedWeaponsBlueprint.ElmReflexBow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/elm-reflex-bow.png",
  name: "Elm Reflex Bow",
  description: "A responsive, flexible bow made from the supple, elastic wood of the elm tree.",
  attack: 24,
  tier: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
  ],
  isTwoHanded: true,
  basePrice: 70,
};
