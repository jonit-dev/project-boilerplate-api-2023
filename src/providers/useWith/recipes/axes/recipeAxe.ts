import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.Axe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.PolishedStone, 10],
      [CraftingResourcesBlueprint.WoodenSticks, 5],
    ]),
  ],
};
