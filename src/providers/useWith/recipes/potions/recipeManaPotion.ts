import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeManaPotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.ManaPotion,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 1,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 5],
};
