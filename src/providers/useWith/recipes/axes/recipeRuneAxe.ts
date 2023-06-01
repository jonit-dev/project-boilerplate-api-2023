import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import {
  AxesBlueprint,
  CraftingResourcesBlueprint,
  MagicsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRuneAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.RuneAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 5],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 10],
      [CraftingResourcesBlueprint.MagicRecipe, 5],
    ]),
  ],
};
