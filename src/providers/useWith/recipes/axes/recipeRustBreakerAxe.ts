import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRustBreakerAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.RustBreakerAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 10],
      [CraftingResourcesBlueprint.CorruptionOre, 10],
      [CraftingResourcesBlueprint.Leather, 1],
    ]),
  ],
};
