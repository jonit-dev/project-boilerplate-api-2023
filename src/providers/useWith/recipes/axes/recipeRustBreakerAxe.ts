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
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 100],
      [CraftingResourcesBlueprint.CorruptionIngot, 20],
      [CraftingResourcesBlueprint.WoodenBoard, 40],
    ]),
  ],
};
