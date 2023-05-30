import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRope: IUseWithCraftingRecipe = {
  outputKey: CraftingResourcesBlueprint.Rope,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 15,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Leather, 20],
      [CraftingResourcesBlueprint.SewingThread, 15],
    ]),
  ],
};
