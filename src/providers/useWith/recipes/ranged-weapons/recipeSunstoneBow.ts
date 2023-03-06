import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  RangedWeaponsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeSunstoneBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.SunstoneBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: MagicsBlueprint.EnergyBoltRune,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
  ],
};
