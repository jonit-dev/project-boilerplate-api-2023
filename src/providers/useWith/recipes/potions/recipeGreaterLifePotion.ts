import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeGreaterLifePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.GreaterLifePotion,
  outputQtyRange: [1, 2],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
  ],
};
