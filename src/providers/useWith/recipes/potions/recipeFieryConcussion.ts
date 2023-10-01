import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeFieryConcussion: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.FieryConcussion,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 10],
};
