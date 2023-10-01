import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeOceanSaberSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.OceanSaberSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 7,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSilk, 8],
      [CraftingResourcesBlueprint.BlueSapphire, 7],
      [CraftingResourcesBlueprint.WoodenBoard, 8],
      [CraftingResourcesBlueprint.SteelIngot, 7],
    ]),
  ],
};
