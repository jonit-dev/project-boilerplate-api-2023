import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeFarmersBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.FarmersBoot,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([[CraftingResourcesBlueprint.Leather, 10]]),
  ],
};
