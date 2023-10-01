import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTigerSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.TigerSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 15],
      [CraftingResourcesBlueprint.WolfTooth, 20],
      [CraftingResourcesBlueprint.WoodenBoard, 40],
    ]),
  ],
};
