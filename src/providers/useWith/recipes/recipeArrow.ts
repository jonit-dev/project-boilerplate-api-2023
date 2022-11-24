import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../useWithTypes";

export const recipeArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.Arrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 1,
    },
  ],
  successChance: 50,
};
