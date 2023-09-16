import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGrandSanguineBattleaxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GrandSanguineBattleaxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 40],
      [CraftingResourcesBlueprint.RedSapphire, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
      [CraftingResourcesBlueprint.GreenIngot, 30],
    ]),
  ],
};
