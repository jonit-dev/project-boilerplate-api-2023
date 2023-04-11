import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTurban: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.Turban,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Silk, 20],
      [CraftingResourcesBlueprint.Leather, 4],
    ]),
  ],
};
