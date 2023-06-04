import { ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableRangedTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHorseBow: IEquippableRangedTier1WeaponBlueprint = {
  key: RangedWeaponsBlueprint.HorseBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/horse-bow.png",
  name: "Horse Bow",
  description:
    "A small, lightweight bow designed for use on horseback. It is typically used for hunting and skirmishing, and is known for its speed and accuracy.",
  attack: 12,
  tier: 1,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 75,
};
