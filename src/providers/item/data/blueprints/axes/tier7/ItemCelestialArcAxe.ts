import { IEquippableTwoHandedTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCelestialArcAxe: IEquippableTwoHandedTier7WeaponBlueprint = {
  key: AxesBlueprint.CelestialArcAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/celestial-arc-axe.png",
  name: "Celestial Arc Axe",
  description: "Imbued with astral energy, granting special abilities during night-time.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 110,
  defense: 51,
  isTwoHanded: true,
  tier: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 86,
};
