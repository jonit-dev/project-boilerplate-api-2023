import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCheese: Partial<IItem> = {
  key: "cheese",
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cheese.png",
  textureKey: "cheese",
  name: "Cheese",
  description: "A cheese wheel.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
