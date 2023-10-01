import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeDiamondSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.DiamondSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 120,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 90,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Diamond, 100],
      [CraftingResourcesBlueprint.SteelIngot, 130],
      [CraftingResourcesBlueprint.WoodenBoard, 120],
      [CraftingResourcesBlueprint.Jade, 90],
    ]),
  ],
};
