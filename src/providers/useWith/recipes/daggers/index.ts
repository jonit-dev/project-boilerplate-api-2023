import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeDagger } from "./recipeDagger";

export const recipeDaggersIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.Bone]: [recipeDagger],
};
