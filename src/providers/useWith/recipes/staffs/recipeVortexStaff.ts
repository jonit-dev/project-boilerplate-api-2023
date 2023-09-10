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
      qty: 13,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 13],
      [CraftingResourcesBlueprint.BlueSapphire, 6],
      [CraftingResourcesBlueprint.MagicRecipe, 2],
    ]),
  ],
};
