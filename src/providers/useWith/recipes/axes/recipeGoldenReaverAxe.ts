import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGoldenReaverAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GoldenReaverAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 50],
      [CraftingResourcesBlueprint.PolishedStone, 30],
      [CraftingResourcesBlueprint.SteelIngot, 50],
      [CraftingResourcesBlueprint.PhoenixFeather, 50],
    ]),
  ],
};
