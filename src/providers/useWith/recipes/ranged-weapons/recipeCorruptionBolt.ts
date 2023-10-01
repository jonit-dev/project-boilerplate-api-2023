import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCorruptionBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.CorruptionBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 5],
};
