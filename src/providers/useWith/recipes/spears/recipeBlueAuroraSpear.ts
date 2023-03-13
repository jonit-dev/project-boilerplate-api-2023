import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBlueAuroraSpear: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.BlueAuroraSpear,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
};
