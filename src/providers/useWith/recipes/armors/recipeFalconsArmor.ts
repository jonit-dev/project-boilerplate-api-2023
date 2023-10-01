import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFalconsArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.FalconsArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 45,
    },
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenIngot, 45],
      [CraftingResourcesBlueprint.SteelIngot, 40],
      [CraftingResourcesBlueprint.BlueSapphire, 50],
      [CraftingResourcesBlueprint.PhoenixFeather, 40],
    ]),
  ],
};
