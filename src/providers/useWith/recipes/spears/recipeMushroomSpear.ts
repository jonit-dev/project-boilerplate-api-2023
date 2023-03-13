import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeMushroomSpear: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.MushroomSpear,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
  ],
};
