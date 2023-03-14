import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIceShardLongsword: Partial<IItem> = {
  key: SwordsBlueprint.IceShardLongsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ice-shard-longsword.png",
  name: "Ice Shard Longsword",
  description:
    "A long sword with a white blade and a blue ricasso, with a hilt made of blue-tinted metal in the shape of a jagged ice shard.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 16,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};