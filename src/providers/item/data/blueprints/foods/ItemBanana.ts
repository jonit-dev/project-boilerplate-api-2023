import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBanana: Partial<IItem> = {
  key: "banana",
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/banana.png",
  textureKey: "banana",
  name: "Banana",
  description: "A ripe banana.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
