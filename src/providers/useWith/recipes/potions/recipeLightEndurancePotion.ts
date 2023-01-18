import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeLightEndurancePotion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.LightEndurancePotion,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 1,
    },
  ],
  successChance: 35,
};