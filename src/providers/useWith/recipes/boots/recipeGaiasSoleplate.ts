import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGaiasSoleplate: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.GaiasSoleplate,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 80,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 37],
};
