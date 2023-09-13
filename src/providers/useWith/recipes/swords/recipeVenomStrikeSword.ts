import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVenomStrikeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.VenomStrikeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 11,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 18,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenOre, 9],
      [CraftingResourcesBlueprint.Herb, 11],
      [CraftingResourcesBlueprint.Leather, 18],
    ]),
  ],
};
