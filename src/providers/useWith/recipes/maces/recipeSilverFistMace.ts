import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSilverFistMace: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SilverFistMace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 30,
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
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 30],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
      [CraftingResourcesBlueprint.SteelIngot, 30],
      [CraftingResourcesBlueprint.IronIngot, 50],
    ]),
  ],
};
