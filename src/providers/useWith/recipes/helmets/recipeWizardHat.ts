import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
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
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueLeather, 10],
      [CraftingResourcesBlueprint.BlueSilk, 4],
    ]),
  ],
};
