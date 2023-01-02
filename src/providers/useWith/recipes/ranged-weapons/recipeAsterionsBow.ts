import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeAsterionsBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.AsterionsBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 1,
    },
  ],
  successChance: 35,
};
