import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVortexStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.VortexStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 130,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 130],
      [CraftingResourcesBlueprint.BlueSapphire, 60],
      [CraftingResourcesBlueprint.MagicRecipe, 20],
    ]),
  ],
};
