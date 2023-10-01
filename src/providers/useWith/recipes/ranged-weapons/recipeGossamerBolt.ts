import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGossamerBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GossamerBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 3,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 4],
};
