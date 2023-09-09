import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeOceanSaberSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.OceanSaberSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSilk, 3],
      [CraftingResourcesBlueprint.BlueSapphire, 8],
      [CraftingResourcesBlueprint.Leather, 5],
    ]),
  ],
};
