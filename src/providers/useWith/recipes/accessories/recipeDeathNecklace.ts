import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeDeathNecklace: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.DeathNecklace,
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
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 1,
    },
  ],
  successChance: 35,
};
