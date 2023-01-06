import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionSword: Partial<IItem> = {
  key: SwordsBlueprint.CorruptionSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/corruption-sword.png",
  name: "Corruption Sword",
  description: "A sword imbued with corrupting or malevolent powers",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
