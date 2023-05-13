import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperOre: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.CopperOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/copper-ore.png",
  name: "Copper Ore",
  description: "Copper ore that can be smelted into ingots.",
  weight: 1.4,
  maxStackSize: 100,
  basePrice: 15,
  canSell: false,
};
