import { IEquippableMeleeTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronFistSword: IEquippableMeleeTier8WeaponBlueprint = {
  key: SwordsBlueprint.IronFistSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/iron-fist-sword.png",
  name: "Iron Fist Sword",
  description:
    "Forged by a legendary smith under a mountain, this sword enhances the resolve and physical strength of its wielder.",
  attack: 60,
  defense: 58,
  tier: 8,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 150,
};
