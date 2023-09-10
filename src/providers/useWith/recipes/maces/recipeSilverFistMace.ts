import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSilverFistMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SilverFistMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 15],
      [CraftingResourcesBlueprint.Diamond, 4],
      [CraftingResourcesBlueprint.Silk, 2],
    ]),
  ],
};
