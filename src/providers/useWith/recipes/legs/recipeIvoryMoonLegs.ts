import { CraftingResourcesBlueprint, LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeIvoryMoonLegs: IUseWithCraftingRecipe = {
  outputKey: LegsBlueprint.IvoryMoonLegs,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 28],
};
