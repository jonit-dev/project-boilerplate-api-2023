import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTurban: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.Turban,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 4,
    },
  ],
};
