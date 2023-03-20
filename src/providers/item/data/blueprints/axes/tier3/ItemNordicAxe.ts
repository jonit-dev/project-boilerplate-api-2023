import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemNordicAxe: IEquippableTwoHandedTier3WeaponBlueprint = {
  key: AxesBlueprint.NordicAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/nordic-axe.png",
  name: "Nordic Axe",
  description: "A large, two-handed axe with a long reach and high damage.",
  attack: 46,
  defense: 23,
  tier: 3,
  weight: 2,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
