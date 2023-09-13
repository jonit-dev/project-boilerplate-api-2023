import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDragonFistHammer: IEquippableMeleeTier10WeaponBlueprint = {
  key: HammersBlueprint.DragonFistHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/dragon-fist-hammer.png",
  name: "Dragon Fist Hammer",
  description:
    "Crafted from the scales of a dragon, this hammer combines the creature’s fiery breath and unmatched strength in its attacks.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 76,
  defense: 42,
  tier: 10,
  rangeType: EntityAttackType.Melee,
};
