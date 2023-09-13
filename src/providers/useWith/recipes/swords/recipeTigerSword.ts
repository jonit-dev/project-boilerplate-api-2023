import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTigerSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.TigerSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 19,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 3],
      [CraftingResourcesBlueprint.WolfTooth, 10],
      [CraftingResourcesBlueprint.Leather, 19],
    ]),
  ],
};
