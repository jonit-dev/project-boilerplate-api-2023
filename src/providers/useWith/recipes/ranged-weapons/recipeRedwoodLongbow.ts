import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeRedwoodLongbow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.RedwoodLongbow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 5,
    },
  ],
};
