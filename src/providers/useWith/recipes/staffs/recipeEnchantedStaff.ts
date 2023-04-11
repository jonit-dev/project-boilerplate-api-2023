import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeEnchantedStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.EnchantedStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueFeather, 4],
      [CraftingResourcesBlueprint.ObsidiumIngot, 3],
      [CraftingResourcesBlueprint.BlueSapphire, 3],
    ]),
  ],
};
