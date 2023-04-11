import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeDeathNecklace: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.DeathNecklace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.Bone,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionOre, 3],
      [CraftingResourcesBlueprint.Rope, 1],
      [CraftingResourcesBlueprint.WolfTooth, 1],
      [CraftingResourcesBlueprint.Bone, 1],
    ]),
  ],
};
