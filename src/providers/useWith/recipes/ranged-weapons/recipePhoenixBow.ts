import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipePhoenixBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.PhoenixBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
  ],
};
