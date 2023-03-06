import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeForceShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.ForceShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
    {
      key: MagicsBlueprint.ThunderRune,
      qty: 10,
    },
  ],
};
