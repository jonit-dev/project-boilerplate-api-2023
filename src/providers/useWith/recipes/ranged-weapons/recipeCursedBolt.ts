import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCursedBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.CursedBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 5],
      [CraftingResourcesBlueprint.Skull, 10],
      [CraftingResourcesBlueprint.Bone, 20],
      [CraftingResourcesBlueprint.WoodenSticks, 20],
    ]),
  ],
};
