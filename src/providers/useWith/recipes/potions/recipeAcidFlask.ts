import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeAcidFlask: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.AcidFlask,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 5],
};
