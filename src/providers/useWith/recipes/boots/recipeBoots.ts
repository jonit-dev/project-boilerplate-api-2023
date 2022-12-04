import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.Boots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
  ],
  successChance: 70,
};
