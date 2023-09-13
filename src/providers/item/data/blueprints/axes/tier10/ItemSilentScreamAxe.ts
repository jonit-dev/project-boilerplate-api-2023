import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSilentScreamAxe: IEquippableMeleeTier10WeaponBlueprint = {
  key: AxesBlueprint.SilentScreamAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/silent-scream-axe.png",
  name: "Silent Scream Axe",
  description: "This eerie weapon silences foes upon impact, making it perfect for disrupting enemy spellcasters.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 78,
  defense: 28,
  tier: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 95,
};
