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
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 4],
      [CraftingResourcesBlueprint.RedSapphire, 5],
      [CraftingResourcesBlueprint.Herb, 3],
    ]),
  ],
};
