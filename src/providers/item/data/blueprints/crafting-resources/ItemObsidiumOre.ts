import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemObsidiumOre: Partial<IItem> = {
  key: CraftingResourcesBlueprint.ObsidiumOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/obsidium-ore.png",
  name: "Obsidium Ore",
  description: "Obsidium ore that can be smelted into ingots.",
  weight: 0.5,
  maxStackSize: 100,
  hasUseWith: true,
};
