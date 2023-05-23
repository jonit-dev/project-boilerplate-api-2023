import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCorrosiveElixir: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.CorrosiveElixir,
  outputQtyRange: [1, 4],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 10,
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
  minCraftingRequirements: [CraftingSkill.Alchemy, 5],
};