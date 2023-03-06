import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  ShieldsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeDarkShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.DarkShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 5,
    },
  ],
};
