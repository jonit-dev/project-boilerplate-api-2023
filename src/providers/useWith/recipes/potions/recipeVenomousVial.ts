import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeVenomousVial: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.VenomousVial,
  outputQtyRange: [1, 5],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 1,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 4],
};
