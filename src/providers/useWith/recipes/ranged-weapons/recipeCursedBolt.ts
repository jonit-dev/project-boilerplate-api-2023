import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCursedBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.CursedBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionOre, 1],
      [CraftingResourcesBlueprint.Skull, 1],
      [CraftingResourcesBlueprint.Bone, 2],
    ]),
  ],
};
