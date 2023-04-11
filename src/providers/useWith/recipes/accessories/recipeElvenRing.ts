import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeElvenRing: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.ElvenRing,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Diamond, 1],
      [CraftingResourcesBlueprint.ElvenLeaf, 3],
      [CraftingResourcesBlueprint.ElvenWood, 2],
    ]),
  ],
};
