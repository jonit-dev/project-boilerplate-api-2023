import { MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeMace } from "./recipeMace";
import { recipeSpikedClub } from "./recipeSpikedClub";

export const recipeMacesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [MacesBlueprint.SpikedClub]: [recipeSpikedClub],
  [MacesBlueprint.Mace]: [recipeMace],
};
