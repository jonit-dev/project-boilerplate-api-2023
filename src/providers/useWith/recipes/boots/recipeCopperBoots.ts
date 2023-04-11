import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCopperBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.CopperBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 3],
      [CraftingResourcesBlueprint.Leather, 2],
    ]),
  ],
};
