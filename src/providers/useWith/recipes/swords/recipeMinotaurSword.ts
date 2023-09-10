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
      qty: 17,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 14,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 12,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 16,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 17],
      [CraftingResourcesBlueprint.Bone, 14],
      [CraftingResourcesBlueprint.Leather, 12],
      [CraftingResourcesBlueprint.ObsidiumIngot, 20],
      [CraftingResourcesBlueprint.SteelIngot, 16],
    ]),
  ],
};
