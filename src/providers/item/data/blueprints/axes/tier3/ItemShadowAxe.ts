import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemShadowAxe: IEquippableTwoHandedTier3WeaponBlueprint = {
  key: AxesBlueprint.ShadowAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/shadow-axe.png",
  name: "Shadow Axe",
  description: "An axe infused with shadow corrupted magic.",
  attack: 50,
  defense: 27,
  tier: 3,
  weight: 2,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 65,
};
