import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBread: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.Bread,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Wheat,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 3,
    },
  ],
};
