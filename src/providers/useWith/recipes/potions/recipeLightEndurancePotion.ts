import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeLightEndurancePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightEndurancePotion,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Herb, 3],
      [CraftingResourcesBlueprint.GreenOre, 2],
      [CraftingResourcesBlueprint.WaterBottle, 2],
    ]),
  ],
};
