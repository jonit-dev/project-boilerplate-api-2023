import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionOre: Partial<IItem> = {
  key: CraftingResourcesBlueprint.CorruptionOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/corruption-ore.png",
  name: "Corruption Ore",
  description: "Corruption ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 100,
  hasUseWith: true,
  basePrice: 25,
};
