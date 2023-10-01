import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeLightAntidote: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightAntidote,
  outputQtyRange: [5, 10],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 4],
};
