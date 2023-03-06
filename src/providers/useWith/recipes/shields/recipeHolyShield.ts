import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeHolyShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.HolyShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ColoredFeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.HealRune,
      qty: 5,
    },
  ],
};
