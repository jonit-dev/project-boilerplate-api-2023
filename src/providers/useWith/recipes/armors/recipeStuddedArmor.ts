import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeStuddedArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.StuddedArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 8,
    },
  ],
};
