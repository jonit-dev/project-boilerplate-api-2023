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
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenOre, 50],
      [CraftingResourcesBlueprint.RedSapphire, 70],
      [CraftingResourcesBlueprint.MagicRecipe, 20],
    ]),
  ],
};
