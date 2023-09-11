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
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 80],
      [CraftingResourcesBlueprint.Diamond, 50],
      [CraftingResourcesBlueprint.MagicRecipe, 40],
    ]),
  ],
};
