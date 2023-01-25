import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWizardHat: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.WizardHat,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 4,
    },
  ],
};
