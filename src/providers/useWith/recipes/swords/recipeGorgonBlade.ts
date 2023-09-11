import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGorgonBlade: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.GorgonBlade,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 100,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenIngot, 100],
      [CraftingResourcesBlueprint.Eye, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 100],
    ]),
  ],
};
