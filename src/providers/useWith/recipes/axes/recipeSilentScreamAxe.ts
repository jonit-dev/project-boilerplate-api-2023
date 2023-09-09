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
      qty: 12,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 12],
      [CraftingResourcesBlueprint.Skull, 6],
      [CraftingResourcesBlueprint.BatsWing, 4],
    ]),
  ],
};
