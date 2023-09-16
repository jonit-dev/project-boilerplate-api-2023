import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGloriousAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GloriousAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 20],
      [CraftingResourcesBlueprint.Diamond, 30],
      [CraftingResourcesBlueprint.PolishedStone, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
      [CraftingResourcesBlueprint.CorruptionIngot, 30],
    ]),
  ],
};
