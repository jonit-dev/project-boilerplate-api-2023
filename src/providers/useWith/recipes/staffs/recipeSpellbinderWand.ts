import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSpellbinderWand: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.SpellbinderWand,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 8],
      [CraftingResourcesBlueprint.Diamond, 5],
      [CraftingResourcesBlueprint.MagicRecipe, 4],
    ]),
  ],
};
