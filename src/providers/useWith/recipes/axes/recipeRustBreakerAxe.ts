import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRustBreakerAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.RustBreakerAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 75,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 70,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 34],
};
