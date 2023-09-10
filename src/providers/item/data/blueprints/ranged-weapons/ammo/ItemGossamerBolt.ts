import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGossamerBolt: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.GossamerBolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/gossamer-bolt.png",
  name: "Gossamer Bolt",
  description:
    "Made from spider silk and lightweight materials, these arrows are silent but deadly, perfect for assassinations.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 8,
  attack: 17,
  canSell: false,
};
