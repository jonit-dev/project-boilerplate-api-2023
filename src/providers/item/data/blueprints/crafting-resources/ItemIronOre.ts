import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronOre: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.IronOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/iron-ore.png",
  name: "Iron Ore",
  description: "Iron ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 100,
  basePrice: 7,
  canSell: false,
};
