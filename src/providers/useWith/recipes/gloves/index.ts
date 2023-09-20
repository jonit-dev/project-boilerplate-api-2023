import { GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeEtherealEmbrace } from "./recipeEtherealEmbrace";
import { recipeGlovesOfGrace } from "./recipeGlovesOfGrace";
import { recipeLeatherGloves } from "./recipeLeatherGloves";
import { recipeRoyalDecreeGloves } from "./recipeRoyalDecreeGloves";
import { recipeRunicRadianceGloves } from "./recipeRunicRadianceGloves";
import { recipeShadowlordGloves } from "./recipeShadowlordGloves";

export const recipeGlovesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [GlovesBlueprint.LeatherGloves]: [recipeLeatherGloves],
  [GlovesBlueprint.EtherealEmbrace]: [recipeEtherealEmbrace],
  [GlovesBlueprint.GlovesOfGrace]: [recipeGlovesOfGrace],
  [GlovesBlueprint.RoyalDecreeGloves]: [recipeRoyalDecreeGloves],
  [GlovesBlueprint.RunicRadianceGloves]: [recipeRunicRadianceGloves],
  [GlovesBlueprint.ShadowlordGloves]: [recipeShadowlordGloves],
};
