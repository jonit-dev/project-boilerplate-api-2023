import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenOre: Partial<IItem> = {
  key: CraftingResourcesBlueprint.GoldenOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/golden-ore.png",
  name: "Golden Ore",
  description: "Golden ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 100,
  hasUseWith: true,
};
