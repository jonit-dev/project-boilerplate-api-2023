import { SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBlueAuroraSpear } from "./recipeBlueAuroraSpear";
import { recipeEarthbinderSpear } from "./recipeEarthbinderSpear";
import { recipeMushroomSpear } from "./recipeMushroomSpear";
import { recipeSpear } from "./recipeSpear";
import { recipeWhiteDragonSpear } from "./recipeWhiteDragonSpear";

export const recipeSpearsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [SpearsBlueprint.Spear]: [recipeSpear],
  [SpearsBlueprint.BlueAuroraSpear]: [recipeBlueAuroraSpear],
  [SpearsBlueprint.EarthbinderSpear]: [recipeEarthbinderSpear],
  [SpearsBlueprint.MushroomSpear]: [recipeMushroomSpear],
  [SpearsBlueprint.WhiteDragonSpear]: [recipeWhiteDragonSpear],
};
