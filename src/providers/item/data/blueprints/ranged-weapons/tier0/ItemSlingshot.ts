import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangeTypes } from "../../../types/RangedWeaponTypes";
import { IEquippableRangedTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSlingshot: IEquippableRangedTier0WeaponBlueprint = {
  key: RangedWeaponsBlueprint.Slingshot,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/slingshot.png",
  name: "Wooden Slingshot",
  description:
    "A weapon used for shooting stones and usually made of a strip of wood bent by a cord connecting the two end.",
  attack: 6,
  tier: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Short,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Stone],
  isTwoHanded: true,
  basePrice: 49,
};
