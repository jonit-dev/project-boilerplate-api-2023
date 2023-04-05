import { BootsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBloodfireBoots } from "./recipeBloodfireBoots";
import { recipeCopperBoots } from "./recipeCopperBoots";
import { recipePlateBoots } from "./recipePlateBoots";
import { recipeStuddedBoots } from "./recipeStuddedBoots";
import { recipeBoots } from "./recipeBoots";
import { recipeSandals } from "./recipeSandals";
import { recipeFarmersBoots } from "./recipeFarmersBoots";

export const recipeBootsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [BootsBlueprint.StuddedBoots]: [recipeStuddedBoots],
  [BootsBlueprint.CopperBoots]: [recipeCopperBoots],
  [BootsBlueprint.PlateBoots]: [recipePlateBoots],
  [BootsBlueprint.BloodfireBoot]: [recipeBloodfireBoots],
  [BootsBlueprint.Boots]: [recipeBoots],
  [BootsBlueprint.Sandals]: [recipeSandals],
  [BootsBlueprint.FarmersBoot]: [recipeFarmersBoots],
};
