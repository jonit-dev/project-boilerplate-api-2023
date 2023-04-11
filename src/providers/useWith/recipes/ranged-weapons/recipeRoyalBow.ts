import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRoyalBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.Bow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 15,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Rope, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 15],
      [CraftingResourcesBlueprint.RedSapphire, 15],
      [CraftingResourcesBlueprint.PhoenixFeather, 15],
      [CraftingResourcesBlueprint.PolishedStone, 15],
    ]),
  ],
};
