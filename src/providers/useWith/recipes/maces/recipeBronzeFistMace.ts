import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBronzeFistMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.BronzeFistMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 10],
      [CraftingResourcesBlueprint.WoodenBoard, 5],
      [CraftingResourcesBlueprint.Leather, 5],
    ]),
  ],
};
