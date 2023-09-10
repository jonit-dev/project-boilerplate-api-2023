import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeBloodseekerBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.BloodseekerBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Bones,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Bones, 3],
      [CraftingResourcesBlueprint.Herb, 2],
      [CraftingResourcesBlueprint.Skull, 2],
    ]),
  ],
};
