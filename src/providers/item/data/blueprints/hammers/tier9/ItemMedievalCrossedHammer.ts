import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMedievalCrossedHammer: IEquippableMeleeTier9WeaponBlueprint = {
  key: HammersBlueprint.MedievalCrossedHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/medieval-crossed-hammer.png",
  name: "Medieval Crossed Hammer",
  description: "A dual-headed hammer that combines brute force with historical craftsmanship.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 70,
  defense: 40,
  tier: 9,
  rangeType: EntityAttackType.Melee,
};
