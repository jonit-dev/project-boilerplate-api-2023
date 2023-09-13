import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVioletVenomSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.VioletVenomSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 12,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenOre, 15],
      [CraftingResourcesBlueprint.Herb, 3],
      [CraftingResourcesBlueprint.Leather, 5],
      [CraftingResourcesBlueprint.ObsidiumOre, 12],
    ]),
  ],
};
