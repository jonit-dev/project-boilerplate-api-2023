import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSpikedClub: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SpikedClub,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 1,
    },
  ],
};
