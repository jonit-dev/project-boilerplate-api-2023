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
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Bones, 100],
      [CraftingResourcesBlueprint.Herb, 20],
      [CraftingResourcesBlueprint.Skull, 100],
      [CraftingResourcesBlueprint.WoodenBoard, 50],
      [CraftingResourcesBlueprint.SteelIngot, 20],
    ]),
  ],
};
