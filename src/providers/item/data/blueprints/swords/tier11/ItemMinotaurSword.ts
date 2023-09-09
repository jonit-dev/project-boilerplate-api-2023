import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMinotaurSword: IEquippableMeleeTier11WeaponBlueprint = {
  key: SwordsBlueprint.MinotaurSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/minotaur-sword.png",
  name: "Minotaur Sword",
  description:
    "Made from bronze salvaged from the labyrinth of Crete, this sword grants the wielder a portion of the Minotaurs brute strength.",
  attack: 80,
  defense: 79,
  tier: 11,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 182,
};
