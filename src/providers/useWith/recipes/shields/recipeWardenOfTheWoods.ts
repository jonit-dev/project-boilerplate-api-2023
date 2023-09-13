import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeWardenOfTheWoods: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.WardenOfTheWoods,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 8,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ElvenWood, 8],
      [CraftingResourcesBlueprint.ElvenLeaf, 5],
      [CraftingResourcesBlueprint.Herb, 8],
    ]),
  ],
};
