import { BooksBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeArcaneArbiterChronicles } from "./recipeArcaneArbiterChronicles";
import { recipeEmberSageScripture } from "./recipeEmberSageScripture";
import { recipeFrostWraithTome } from "./recipeFrostWraithTome";
import { recipeMysticWardenCodex } from "./recipeMysticWardenCodex";
import { recipeStormbringerGrimoire } from "./recipeStormbringerGrimoire";

export const recipeBooksIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [BooksBlueprint.ArcaneArbiterChronicles]: [recipeArcaneArbiterChronicles],
  [BooksBlueprint.EmberSageScripture]: [recipeEmberSageScripture],
  [BooksBlueprint.FrostWraithTome]: [recipeFrostWraithTome],
  [BooksBlueprint.MysticWardenCodex]: [recipeMysticWardenCodex],
  [BooksBlueprint.StormbringerGrimoire]: [recipeStormbringerGrimoire],
};
