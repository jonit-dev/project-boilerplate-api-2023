import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenOre: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.GoldenOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/golden-ore.png",
  name: "Golden Ore",
  description: "Golden ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 100,
  basePrice: 40,
  canSell: false,
};
