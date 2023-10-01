import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGoldenArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GoldenArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 7,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 15,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Feather, 10],
      [CraftingResourcesBlueprint.ElvenWood, 7],
      [CraftingResourcesBlueprint.GoldenIngot, 15],
    ]),
  ],
};
