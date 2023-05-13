import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeWoodenAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.WoodenAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 12,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 1],
};
