import { CraftingResourcesBlueprint, LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHoneyGlowLegs: IUseWithCraftingRecipe = {
  outputKey: LegsBlueprint.HoneyGlowLegs,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 25],
};
