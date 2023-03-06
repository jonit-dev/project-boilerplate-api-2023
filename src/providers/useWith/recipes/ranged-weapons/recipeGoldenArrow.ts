import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeGoldenArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GoldenArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 1,
    },
  ],
};
