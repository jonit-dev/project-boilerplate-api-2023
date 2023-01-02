import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeFrostDagger: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.FrostDagger,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 1,
    },
  ],
  successChance: 35,
};
