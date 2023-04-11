import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeElmReflexBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.ElmReflexBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 5],
      [CraftingResourcesBlueprint.BlueFeather, 5],
      [CraftingResourcesBlueprint.ElvenWood, 5],
      [CraftingResourcesBlueprint.Silk, 3],
    ]),
  ],
};
