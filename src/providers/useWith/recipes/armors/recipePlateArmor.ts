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
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 5,
    },

    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 20],
      [CraftingResourcesBlueprint.IronIngot, 15],
      [CraftingResourcesBlueprint.CopperIngot, 5],
      [CraftingResourcesBlueprint.Leather, 5],
    ]),
  ],
};
