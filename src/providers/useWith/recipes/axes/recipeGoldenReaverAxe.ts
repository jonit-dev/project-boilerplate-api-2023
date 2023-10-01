import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGoldenReaverAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GoldenReaverAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 150,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 140,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 125,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 125,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 10,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 40],
};
