import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeMinotaurSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.MinotaurSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 80],
      [CraftingResourcesBlueprint.Bone, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 60],
      [CraftingResourcesBlueprint.ObsidiumIngot, 50],
      [CraftingResourcesBlueprint.SteelIngot, 20],
    ]),
  ],
};
