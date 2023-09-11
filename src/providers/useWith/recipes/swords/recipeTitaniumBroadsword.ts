import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTitaniumBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.TitaniumBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Rock,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenIngot, 80],
      [CraftingResourcesBlueprint.SteelIngot, 30],
      [CraftingResourcesBlueprint.Rock, 80],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
    ]),
  ],
};
