import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeLightManaPotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightManaPotion,
  outputQtyRange: [1, 2],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueFeather, 1],
      [CraftingResourcesBlueprint.WaterBottle, 1],
    ]),
  ],
};
