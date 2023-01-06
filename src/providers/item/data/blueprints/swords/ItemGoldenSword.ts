import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenSword: Partial<IItem> = {
  key: SwordsBlueprint.GoldenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/golden-sword.png",
  name: "Golden Sword",
  description: "A sword made of gold, often associated with wealth, power, and nobility",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
