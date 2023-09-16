import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeInfernoEdgeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.InfernoEdgeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 170,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 180,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 170],
      [CraftingResourcesBlueprint.RedSapphire, 180],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
      [CraftingResourcesBlueprint.DragonTooth, 2],
    ]),
  ],
};
