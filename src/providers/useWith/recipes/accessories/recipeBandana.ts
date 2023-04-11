import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBandana: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.Bandana,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 15,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Leather, 5],
      [CraftingResourcesBlueprint.SewingThread, 15],
    ]),
  ],
};
