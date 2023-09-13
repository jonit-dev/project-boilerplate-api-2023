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
      qty: 17,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 18,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 17],
      [CraftingResourcesBlueprint.RedSapphire, 18],
      [CraftingResourcesBlueprint.Leather, 20],
      [CraftingResourcesBlueprint.DragonTooth, 2],
    ]),
  ],
};
