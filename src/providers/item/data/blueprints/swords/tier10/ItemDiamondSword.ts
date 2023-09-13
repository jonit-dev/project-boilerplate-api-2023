import { IEquippableMeleeTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDiamondSword: IEquippableMeleeTier10WeaponBlueprint = {
  key: SwordsBlueprint.DiamondSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/diamond-sword.png",
  name: "Diamond Sword",
  description: "A nearly indestructible sword crafted from precious diamonds, known for its durability and sharpness.",
  attack: 78,
  defense: 75,
  tier: 10,
  weight: 1.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 175,
};
