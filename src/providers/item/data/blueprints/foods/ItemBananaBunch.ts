import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBananaBunch: Partial<IItem> = {
  key: FoodsBlueprint.BananaBunch,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/banana-bunch.png",
  textureKey: "banana-bunch",
  name: "Banana Bunch",
  description: "A bundle of ripe bananas.",
  weight: 0.03,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
