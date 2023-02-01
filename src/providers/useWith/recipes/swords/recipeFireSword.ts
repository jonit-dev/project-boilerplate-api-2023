import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFireSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.FireSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 5,
    },
    {
      key: MagicsBlueprint.FireRune,
      qty: 8,
    },
  ],
};
