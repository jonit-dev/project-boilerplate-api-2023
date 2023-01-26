import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBandana: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.Bandana,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 15,
    },
  ],
};
