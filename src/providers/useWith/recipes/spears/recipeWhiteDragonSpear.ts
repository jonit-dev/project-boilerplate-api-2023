import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWhiteDragonSpear: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.WhiteDragonSpear,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
  ],
};
