import { CraftingResourcesBlueprint, PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBlazingFirebomb: IUseWithCraftingRecipe = {
  outputKey: PotionsBlueprint.BlazingFirebomb,
  outputQtyRange: [1, 2],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.WaterBottle,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, 7],
};
