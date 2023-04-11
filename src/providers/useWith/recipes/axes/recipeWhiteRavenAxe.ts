import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWhiteRavenAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.WhiteRavenAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenIngot, 8],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
      [CraftingResourcesBlueprint.Eye, 1],
    ]),
  ],
};
