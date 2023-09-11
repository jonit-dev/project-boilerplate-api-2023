import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRoyalGuardianSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.RoyalGuardianSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 200,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 200,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 200],
      [CraftingResourcesBlueprint.SteelIngot, 50],
      [CraftingResourcesBlueprint.RedSapphire, 200],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
    ]),
  ],
};
