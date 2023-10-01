import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGreaterManaPotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.GreaterManaPotion,
  outputQtyRange: [3, 5],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 4,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 15],
};
