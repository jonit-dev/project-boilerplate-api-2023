import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HammersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeSledgeHammer: IUseWithCraftingRecipe = {
  outputKey: HammersBlueprint.SledgeHammer,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 50],
      [CraftingResourcesBlueprint.IronNail, 20],
      [CraftingResourcesBlueprint.GreenIngot, 20],
    ]),
  ],
};
