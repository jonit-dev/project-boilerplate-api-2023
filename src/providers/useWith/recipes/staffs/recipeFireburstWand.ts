import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFireburstWand: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.FireburstWand,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenOre, 5],
      [CraftingResourcesBlueprint.RedSapphire, 7],
      [CraftingResourcesBlueprint.MagicRecipe, 2],
    ]),
  ],
};
