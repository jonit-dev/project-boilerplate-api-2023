import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGlacialArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.GlacialArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
  ],
};
