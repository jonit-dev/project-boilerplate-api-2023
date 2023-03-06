import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeIronArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.IronArrow,
  outputQtyRange: [2, 5],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 1,
    },
  ],
};
