import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBanana: Partial<IItem> = {
  key: FoodsBlueprint.Banana,
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
