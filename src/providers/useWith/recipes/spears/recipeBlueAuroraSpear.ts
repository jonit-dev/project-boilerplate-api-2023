import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBlueAuroraSpear: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.BlueAuroraSpear,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 2],
      [CraftingResourcesBlueprint.BlueSapphire, 5],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
    ]),
  ],
};
