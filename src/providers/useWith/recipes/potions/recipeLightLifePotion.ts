import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeLightLifePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightLifePotion,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 1,
    },

    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 1,
    },
  ],
};
