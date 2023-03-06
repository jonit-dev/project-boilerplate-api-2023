import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeSteelIngot } from "./recipeSteelIngot";

export const recipeCraftingResources: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.SteelIngot]: [recipeSteelIngot],
};
