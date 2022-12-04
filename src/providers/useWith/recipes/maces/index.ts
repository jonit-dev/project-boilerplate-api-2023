import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeSpikedClub } from "./recipeSpikedClub";

export const recipeMacesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.IronNail]: [recipeSpikedClub],
};
