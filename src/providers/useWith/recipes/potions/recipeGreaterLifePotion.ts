import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeGreaterLifePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.GreaterLifePotion,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 5,
    },
  ],
};
