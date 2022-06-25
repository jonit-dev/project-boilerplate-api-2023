import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemFish: Partial<IItem> = {
  key: "fish",
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/fish.png",
  textureKey: "fish",
  name: "Fish",
  description: "A dull fish.",
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
