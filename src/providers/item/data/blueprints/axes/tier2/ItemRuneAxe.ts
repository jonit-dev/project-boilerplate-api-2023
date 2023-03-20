import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRuneAxe: IEquippableTwoHandedTier2WeaponBlueprint = {
  key: AxesBlueprint.RuneAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/rune-axe.png",
  name: "Rune Axe",
  description: "An axe with rune ancient inscriptions.",
  attack: 34,
  defense: 18,
  tier: 2,
  weight: 2.1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
