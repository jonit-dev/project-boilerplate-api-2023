import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBasiliskSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.BasiliskSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumOre, 5],
      [CraftingResourcesBlueprint.GoldenIngot, 5],
      [CraftingResourcesBlueprint.GoldenOre, 8],
    ]),
  ],
};
