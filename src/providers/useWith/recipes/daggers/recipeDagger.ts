import { CraftingResourcesBlueprint, DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeDagger: IUseWithCraftingRecipe = {
  outputKey: DaggersBlueprint.FrostDagger,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
  ],
  successChance: 35,
};
