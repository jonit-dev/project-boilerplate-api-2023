import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWizardHat: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.WizardHat,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 1],
};
