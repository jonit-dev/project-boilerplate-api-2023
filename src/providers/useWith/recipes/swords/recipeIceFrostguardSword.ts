import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFrostguardSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.FrostguardSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 4,
    },
  ],
};
