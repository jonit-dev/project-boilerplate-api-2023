import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBloodstainedCenser: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.BloodstainedCenser,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 4],
      [CraftingResourcesBlueprint.ObsidiumIngot, 3],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 1],
      [CraftingResourcesBlueprint.Bone, 5],
    ]),
  ],
};
