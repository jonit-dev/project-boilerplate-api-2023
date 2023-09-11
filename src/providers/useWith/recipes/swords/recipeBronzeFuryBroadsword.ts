import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBronzeFuryBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.BronzeFuryBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 130,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 50],
      [CraftingResourcesBlueprint.IronIngot, 50],
      [CraftingResourcesBlueprint.RedSapphire, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 130],
    ]),
  ],
};
