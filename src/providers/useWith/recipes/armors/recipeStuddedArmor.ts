import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeStuddedArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.StuddedArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Leather, 8],
      [CraftingResourcesBlueprint.IronIngot, 8],
    ]),
  ],
};
