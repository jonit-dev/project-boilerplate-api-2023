import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeHydraSlayerAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.HydraSlayerAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 75,
    },
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 90,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 38],
};
