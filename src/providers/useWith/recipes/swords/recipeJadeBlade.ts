import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeJadeBlade: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.JadeBlade,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 13,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 7,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Jade, 13],
      [CraftingResourcesBlueprint.ElvenWood, 3],
      [CraftingResourcesBlueprint.Silk, 7],
    ]),
  ],
};
