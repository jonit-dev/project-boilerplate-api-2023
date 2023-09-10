import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeHydraSlayerAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.HydraSlayerAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 5],
      [CraftingResourcesBlueprint.Diamond, 5],
      [CraftingResourcesBlueprint.Rope, 1],
    ]),
  ],
};
