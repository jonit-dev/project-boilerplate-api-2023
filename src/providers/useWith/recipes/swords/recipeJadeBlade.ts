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
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 70,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Jade, 100],
      [CraftingResourcesBlueprint.GreenIngot, 70],
      [CraftingResourcesBlueprint.ElvenWood, 30],
      [CraftingResourcesBlueprint.Silk, 70],
    ]),
  ],
};
