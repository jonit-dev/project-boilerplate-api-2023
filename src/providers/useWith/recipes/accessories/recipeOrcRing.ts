import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeOrcRing: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.OrcRing,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Mining,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 2],
      [CraftingResourcesBlueprint.Jade, 1],
    ]),
  ],
};
