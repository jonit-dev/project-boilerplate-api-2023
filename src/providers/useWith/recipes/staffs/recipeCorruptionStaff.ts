import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCorruptionStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.CorruptionStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
};
