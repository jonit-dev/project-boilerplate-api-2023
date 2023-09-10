import { IEquippableTwoHandedTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPhoenixWingAxe: IEquippableTwoHandedTier6WeaponBlueprint = {
  key: AxesBlueprint.PhoenixWingAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/phoenix-wing-axe.png",
  name: "Phoenix Wing Axe",
  description: "Allows the wielder to erupt in flames upon reaching critical health, dealing area damage.",
  weight: 3.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 106,
  defense: 50,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  tier: 6,
  basePrice: 92,
};
