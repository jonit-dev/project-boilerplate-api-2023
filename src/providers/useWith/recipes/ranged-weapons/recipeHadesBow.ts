import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeHadesBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.HadesBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 5,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 5,
    },
  ],
};
