import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeLightAntidote: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightAntidote,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.WaterBottle, 1],
      [CraftingResourcesBlueprint.PhoenixFeather, 1],
    ]),
  ],
};
