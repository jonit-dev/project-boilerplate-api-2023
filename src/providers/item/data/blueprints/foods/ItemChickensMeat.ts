import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemChickensMeat: Partial<IItem> = {
  key: FoodsBlueprint.ChickensMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/chickens-meat.png",
  textureKey: "chickens-meat",
  name: "Chickens Meat",
  description: "Chicken meat can be cooked and eaten to restore health",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
};
