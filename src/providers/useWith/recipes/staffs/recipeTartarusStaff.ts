import {
  CraftingResourcesBlueprint,
  MagicsBlueprint,
  StaffsBlueprint,
} from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTartarusStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.TartarusStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 5,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 24],
};
