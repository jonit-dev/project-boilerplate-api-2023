import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSword: Partial<IItem> = {
  key: SwordsBlueprint.Sword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/sword.png",
  name: "Sword",
  description: "A weapon with a long, sharp blade and a hilt for grip",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 68,
};
