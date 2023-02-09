import { ArmorsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBronzeArmor } from "./recipeBronzeArmor";
import { recipeIronArmor } from "./recipeIronArmor";
import { recipePlateArmor } from "./recipePlateArmor";

export const recipeArmorsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [ArmorsBlueprint.IronArmor]: [recipeIronArmor],
  [ArmorsBlueprint.BronzeArmor]: [recipeBronzeArmor],
  [ArmorsBlueprint.PlateArmor]: [recipePlateArmor],
};
