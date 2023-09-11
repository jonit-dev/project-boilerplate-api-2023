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
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSilk, 30],
      [CraftingResourcesBlueprint.BlueSapphire, 80],
      [CraftingResourcesBlueprint.WoodenBoard, 50],
      [CraftingResourcesBlueprint.SteelIngot, 50],
    ]),
  ],
};
