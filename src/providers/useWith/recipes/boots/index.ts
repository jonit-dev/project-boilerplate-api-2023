import { BootsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBloodfireBoots } from "./recipeBloodfireBoots";
import { recipeBoots } from "./recipeBoots";
import { recipeCavalierBoots } from "./recipeCavalierBoots";
import { recipeChainBoots } from "./recipeChainBoots";
import { recipeCopperBoots } from "./recipeCopperBoots";
import { recipeFalconBoots } from "./recipeFalconBoots";
import { recipeFarmersBoots } from "./recipeFarmersBoots";
import { recipeGaiasSoleplate } from "./recipeGaiasSoleplate";
import { recipePlateBoots } from "./recipePlateBoots";
import { recipeSandals } from "./recipeSandals";
import { recipeStuddedBoots } from "./recipeStuddedBoots";
import { recipeVoltstepBoots } from "./recipeVoltstepBoots";

export const recipeBootsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [BootsBlueprint.StuddedBoots]: [recipeStuddedBoots],
  [BootsBlueprint.CopperBoots]: [recipeCopperBoots],
  [BootsBlueprint.PlateBoots]: [recipePlateBoots],
  [BootsBlueprint.BloodfireBoot]: [recipeBloodfireBoots],
  [BootsBlueprint.Boots]: [recipeBoots],
  [BootsBlueprint.Sandals]: [recipeSandals],
  [BootsBlueprint.FarmersBoot]: [recipeFarmersBoots],
  [BootsBlueprint.CavalierBoots]: [recipeCavalierBoots],
  [BootsBlueprint.ChainBoots]: [recipeChainBoots],
  [BootsBlueprint.FalconBoots]: [recipeFalconBoots],
  [BootsBlueprint.GaiasSoleplate]: [recipeGaiasSoleplate],
  [BootsBlueprint.VoltstepBoots]: [recipeVoltstepBoots],
};
