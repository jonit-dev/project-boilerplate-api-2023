import { ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableRangedTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBow: IEquippableRangedTier0WeaponBlueprint = {
  key: RangedWeaponsBlueprint.Bow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/bow.png",
  name: "Bow",
  description:
    "A weapon used for shooting arrows and usually made of a strip of wood bent by a cord connecting the two end.",
  attack: 8,
  tier: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow],
  isTwoHanded: true,
  basePrice: 63,
};
