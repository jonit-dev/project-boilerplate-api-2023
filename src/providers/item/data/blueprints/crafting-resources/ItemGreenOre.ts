import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGreenOre: Partial<IItem> = {
  key: CraftingResourcesBlueprint.GreenOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/green-ore.png",
  name: "Green Ore",
  description: "Green ore that can be smelted into ingots.",
  weight: 1.4,
  maxStackSize: 100,
  hasUseWith: true,
  basePrice: 30,
};
