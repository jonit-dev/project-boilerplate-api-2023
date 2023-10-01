import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSpikedClub: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.SpikedClub,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronNail, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 4],
      [CraftingResourcesBlueprint.Skull, 1],
    ]),
  ],
};
