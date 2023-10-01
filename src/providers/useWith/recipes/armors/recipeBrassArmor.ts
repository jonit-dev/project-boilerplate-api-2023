import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBrassArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.BrassArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 18,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Leather, 20],
      [CraftingResourcesBlueprint.CopperIngot, 18],
    ]),
  ],
};
