import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeIronArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.IronArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
  ],
};
