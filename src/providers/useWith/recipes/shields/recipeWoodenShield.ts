import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeWoodenShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.WoodenShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 4,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 1],
};
