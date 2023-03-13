import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeEbonyLongbow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.EbonyLongbow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 5,
    },
  ],
};
