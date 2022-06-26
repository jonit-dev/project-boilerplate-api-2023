import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemApple: Partial<IItem> = {
  key: "apple",
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/apple.png",
  textureKey: "apple",
  name: "Apple",
  description: "A red apple.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
