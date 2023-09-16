import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCenturionBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.CenturionBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 180,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 180],
      [CraftingResourcesBlueprint.Skull, 90],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
    ]),
  ],
};
