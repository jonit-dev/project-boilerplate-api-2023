import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeElvenSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.ElvenSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 3,
    },
  ],
};
