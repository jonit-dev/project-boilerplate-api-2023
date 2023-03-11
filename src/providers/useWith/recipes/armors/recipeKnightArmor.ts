import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeKnightArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.KnightArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
};
