import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBatsWing } from "./ItemBatsWing";
import { itemBlueFeather } from "./ItemBlueFeather";
import { itemBlueSapphire } from "./ItemBlueSapphire";
import { itemColoredFeather } from "./ItemColoredFeather";
import { itemDiamond } from "./ItemDiamond";
import { itemFeather } from "./ItemFeather";
import { itemGoldenIngot } from "./ItemGoldenIngot";
import { itemLeather } from "./ItemLeather";
import { itemSilk } from "./ItemSilk";

export const craftingResourcesBlueprintIndex = {
  [CraftingResourcesBlueprint.BlueSapphire]: itemBlueSapphire,
  [CraftingResourcesBlueprint.BlueFeather]: itemBlueFeather,
  [CraftingResourcesBlueprint.Leather]: itemLeather,
  [CraftingResourcesBlueprint.BatsWing]: itemBatsWing,
  [CraftingResourcesBlueprint.Silk]: itemSilk,
  [CraftingResourcesBlueprint.ColoredFeather]: itemColoredFeather,
  [CraftingResourcesBlueprint.Diamond]: itemDiamond,
  [CraftingResourcesBlueprint.Feather]: itemFeather,
  [CraftingResourcesBlueprint.GoldenIngot]: itemGoldenIngot,
};
