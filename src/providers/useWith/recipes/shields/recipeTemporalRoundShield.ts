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
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 14,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 6],
      [CraftingResourcesBlueprint.SilverIngot, 14],
      [CraftingResourcesBlueprint.MagicRecipe, 2],
    ]),
  ],
};
