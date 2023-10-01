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
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueFeather, 8],
      [CraftingResourcesBlueprint.ObsidiumIngot, 6],
      [CraftingResourcesBlueprint.BlueSapphire, 5],
    ]),
  ],
};
