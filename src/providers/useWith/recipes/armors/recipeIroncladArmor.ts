import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeIroncladArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.IroncladArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 25],
      [CraftingResourcesBlueprint.GoldenIngot, 10],
      [CraftingResourcesBlueprint.Leather, 10],
    ]),
  ],
};
