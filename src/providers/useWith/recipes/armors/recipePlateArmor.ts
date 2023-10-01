import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePlateArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.PlateArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 25,
    },

    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 25],
      [CraftingResourcesBlueprint.IronIngot, 25],
      [CraftingResourcesBlueprint.CopperIngot, 25],
      [CraftingResourcesBlueprint.Leather, 20],
    ]),
  ],
};
