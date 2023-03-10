import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeGreaterManaPotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.GreaterManaPotion,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
  ],
};
