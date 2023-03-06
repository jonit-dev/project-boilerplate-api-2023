import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeShockArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.ShockArrow,
  outputQtyRange: [3, 7],
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
      key: MagicsBlueprint.EnergyBoltRune,
      qty: 2,
    },
  ],
};
