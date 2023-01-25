import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBandana } from "./recipeBandana";
import { recipeCorruptionNecklace } from "./recipeCorruptionNecklace";
import { recipeDeathNecklace } from "./recipeDeathNecklace";
import { recipeElvenRing } from "./recipeElvenRing";

export const recipeAccessoriesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [AccessoriesBlueprint.Bandana]: [recipeBandana],
  [AccessoriesBlueprint.CorruptionNecklace]: [recipeCorruptionNecklace],
  [AccessoriesBlueprint.DeathNecklace]: [recipeDeathNecklace],
  [AccessoriesBlueprint.ElvenRing]: [recipeElvenRing],
};
