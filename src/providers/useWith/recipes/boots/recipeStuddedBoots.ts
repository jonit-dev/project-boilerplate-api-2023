import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeStuddedBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.StuddedBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
  ],
  successChance: 40,
};
