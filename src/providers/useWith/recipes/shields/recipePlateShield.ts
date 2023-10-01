import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePlateShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.PlateShield,
  outputQtyRange: [1, 1],

  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 15],
      [CraftingResourcesBlueprint.PolishedStone, 15],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 15],
      [CraftingResourcesBlueprint.SteelIngot, 2],
    ]),
  ],
};
