import {
  AxesBlueprint,
  CraftingResourcesBlueprint,
  MagicsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeShadowAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.ShadowAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 1,
    },
  ],
};
