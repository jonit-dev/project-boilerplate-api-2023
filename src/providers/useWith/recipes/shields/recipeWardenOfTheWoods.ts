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
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ElvenWood, 80],
      [CraftingResourcesBlueprint.ElvenLeaf, 50],
      [CraftingResourcesBlueprint.Herb, 80],
      [CraftingResourcesBlueprint.MagicRecipe, 20],
    ]),
  ],
};
