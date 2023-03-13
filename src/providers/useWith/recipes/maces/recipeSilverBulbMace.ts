import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSilverBulbMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SilverBulbMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
  ],
};
