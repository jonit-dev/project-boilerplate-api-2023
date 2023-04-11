import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeIroncladHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.IroncladHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 15],
      [CraftingResourcesBlueprint.Leather, 10],
      [CraftingResourcesBlueprint.RedSapphire, 10],
    ]),
  ],
};
