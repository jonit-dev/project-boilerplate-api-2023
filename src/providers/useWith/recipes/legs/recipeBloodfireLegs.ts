import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBloodfireLegs: IUseWithCraftingRecipe = {
  outputKey: LegsBlueprint.BloodfireLegs,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 10],
      [CraftingResourcesBlueprint.SteelIngot, 10],
      [CraftingResourcesBlueprint.GoldenIngot, 10],
      [CraftingResourcesBlueprint.RedSapphire, 5],
    ]),
  ],
};
