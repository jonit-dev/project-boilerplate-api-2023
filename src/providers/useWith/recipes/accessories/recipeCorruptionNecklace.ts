import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeCorruptionNecklace: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.CorruptionNecklace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 1,
    },
  ],
};
