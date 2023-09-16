import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeTemporalRoundShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.TemporalRoundShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 60],
      [CraftingResourcesBlueprint.SilverIngot, 140],
      [CraftingResourcesBlueprint.MagicRecipe, 20],
    ]),
  ],
};
