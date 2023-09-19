import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBronzeArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.BronzeArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 15],
      [CraftingResourcesBlueprint.IronIngot, 15],
      [CraftingResourcesBlueprint.Leather, 10],
    ]),
  ],
};
