import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCheeseSlice: Partial<IItem> = {
  key: "cheese-slice",
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cheese-slice.png",
  textureKey: "cheese-slice",
  name: "Cheese Slice",
  description: "A thick slice of yellow cheese.",
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
