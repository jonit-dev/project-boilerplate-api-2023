import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemEgg: Partial<IItem> = {
  key: "egg",
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/egg.png",
  textureKey: "egg",
  name: "Egg",
  description: "A chicken egg.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
