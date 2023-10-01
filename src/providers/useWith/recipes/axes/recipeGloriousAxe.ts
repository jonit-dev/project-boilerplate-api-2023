import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGloriousAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GloriousAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 70,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 37],
};
