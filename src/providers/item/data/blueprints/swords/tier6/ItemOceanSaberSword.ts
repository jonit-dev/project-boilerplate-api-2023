import { IEquippableMeleeTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemOceanSaberSword: IEquippableMeleeTier6WeaponBlueprint = {
  key: SwordsBlueprint.OceanSaberSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ocean-saber-sword.png",
  name: "Ocean Saber Sword",
  description:
    "Crafted from enchanted coral and imbued with the power of the tides, this sword can control water and summon storms.",
  attack: 45,
  defense: 30,
  tier: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 135,
};
