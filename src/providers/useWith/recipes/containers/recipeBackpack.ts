import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ContainersBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBackpack: IUseWithCraftingRecipe = {
  outputKey: ContainersBlueprint.Backpack,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Leather, 20],
      [CraftingResourcesBlueprint.SewingThread, 20],
    ]),
  ],
};
