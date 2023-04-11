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
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 10],
      [CraftingResourcesBlueprint.ObsidiumIngot, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 1],
      [CraftingResourcesBlueprint.Bone, 5],
      [CraftingResourcesBlueprint.DragonHead, 3],
    ]),
  ],
};
