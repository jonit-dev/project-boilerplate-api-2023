import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeFalconsArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.FalconsArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 25],
      [CraftingResourcesBlueprint.SteelIngot, 25],
      [CraftingResourcesBlueprint.BlueSapphire, 40],
      [CraftingResourcesBlueprint.PhoenixFeather, 20],
    ]),
  ],
};
