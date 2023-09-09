import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGorgonBlade: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.GorgonBlade,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 18,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenOre, 18],
      [CraftingResourcesBlueprint.Eye, 5],
      [CraftingResourcesBlueprint.Leather, 3],
    ]),
  ],
};
