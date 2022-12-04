import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperOre: Partial<IItem> = {
  key: CraftingResourcesBlueprint.CopperOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/copper-ore.png",
  name: "Copper Ore",
  description: "Copper ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 100,
  hasUseWith: true,
};
