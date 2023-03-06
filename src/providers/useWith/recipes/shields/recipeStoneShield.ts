import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeStoneShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.HolyShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
  ],
};
