import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeHellishBronzeStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.HellishBronzeStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 60],
      [CraftingResourcesBlueprint.IronIngot, 80],
      [CraftingResourcesBlueprint.MagicRecipe, 30],
      [CraftingResourcesBlueprint.DragonTooth, 8],
    ]),
  ],
};
