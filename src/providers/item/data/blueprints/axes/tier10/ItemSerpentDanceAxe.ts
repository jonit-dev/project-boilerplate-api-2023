import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSerpentDanceAxe: IEquippableMeleeTier10WeaponBlueprint = {
  key: AxesBlueprint.SerpentDanceAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/serpent-dance-axe.png",
  name: "Serpent Dance Axe",
  description: "Adorned with emerald serpent motifs, each blade can inject a venom that slowly saps the life of foes.",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 75,
  defense: 72,
  tier: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 98,
};
