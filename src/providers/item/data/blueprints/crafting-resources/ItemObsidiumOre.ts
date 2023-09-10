import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemObsidiumOre: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.ObsidiumOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/obsidium-ore.png",
  name: "Obsidium Ore",
  description: "Obsidium ore that can be smelted into ingots.",
  weight: 0.5,
  maxStackSize: 999,
  basePrice: 50,
  canSell: false,
};
