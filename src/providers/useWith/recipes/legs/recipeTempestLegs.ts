import { CraftingResourcesBlueprint, LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTempestLegs: IUseWithCraftingRecipe = {
  outputKey: LegsBlueprint.TempestLegs,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 26],
};
