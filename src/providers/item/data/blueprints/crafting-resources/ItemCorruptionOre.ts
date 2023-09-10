import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionOre: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.CorruptionOre,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/corruption-ore.png",
  name: "Corruption Ore",
  description: "Corruption ore that can be smelted into ingots.",
  weight: 2,
  maxStackSize: 999,
  basePrice: 30,
  canSell: false,
};
