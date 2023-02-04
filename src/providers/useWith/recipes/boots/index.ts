import { BootsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeCopperBoots } from "./recipeCopperBoots";
import { recipePlateBoots } from "./recipePlateBoots";
import { recipeStuddedBoots } from "./recipeStuddedBoots";

export const recipeBootsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [BootsBlueprint.StuddedBoots]: [recipeStuddedBoots],
  [BootsBlueprint.CopperBoots]: [recipeCopperBoots],
  [BootsBlueprint.PlateBoots]: [recipePlateBoots],
};
