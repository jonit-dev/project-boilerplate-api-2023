import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeLightAntidote: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightAntidote,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 1,
    },
  ],
};
