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
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Jade, 50],
      [CraftingResourcesBlueprint.GreenIngot, 30],
      [CraftingResourcesBlueprint.ElvenWood, 20],
      [CraftingResourcesBlueprint.Silk, 20],
    ]),
  ],
};
