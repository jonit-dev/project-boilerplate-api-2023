import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSilentScreamAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.SilentScreamAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 30],
      [CraftingResourcesBlueprint.Skull, 60],
      [CraftingResourcesBlueprint.BatsWing, 40],
      [CraftingResourcesBlueprint.WoodenBoard, 50],
    ]),
  ],
};
