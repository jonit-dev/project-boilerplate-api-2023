import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  SwordsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCorruptionSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.CorruptionSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 6,
    },
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 5,
    },
  ],
};
