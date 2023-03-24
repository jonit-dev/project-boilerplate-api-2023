import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTartarusStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.TartarusStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 10,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 10,
    },
  ],
};
