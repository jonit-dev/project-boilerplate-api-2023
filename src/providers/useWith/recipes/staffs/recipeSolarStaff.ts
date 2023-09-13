import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSolarStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.SolarStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 9],
      [CraftingResourcesBlueprint.Diamond, 9],
      [CraftingResourcesBlueprint.MagicRecipe, 1],
    ]),
  ],
};
