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
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 40],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
      [CraftingResourcesBlueprint.SteelIngot, 30],
      [CraftingResourcesBlueprint.IronIngot, 80],
    ]),
  ],
};
