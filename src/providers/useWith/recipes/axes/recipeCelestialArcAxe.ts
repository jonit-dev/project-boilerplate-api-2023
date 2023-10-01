import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCelestialArcAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.CelestialArcAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 40,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 32],
};
