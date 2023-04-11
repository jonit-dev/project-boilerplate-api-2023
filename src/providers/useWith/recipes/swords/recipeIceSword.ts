import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeIceSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.IceSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 3],
      [CraftingResourcesBlueprint.SilverIngot, 6],
      [CraftingResourcesBlueprint.GoldenOre, 5],
    ]),
  ],
};
