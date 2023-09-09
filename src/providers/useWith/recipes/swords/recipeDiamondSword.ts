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
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 13,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 14,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 6,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Diamond, 8],
      [CraftingResourcesBlueprint.SteelIngot, 13],
      [CraftingResourcesBlueprint.Leather, 14],
      [CraftingResourcesBlueprint.Jade, 6],
    ]),
  ],
};
