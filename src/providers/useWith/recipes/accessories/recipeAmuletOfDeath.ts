import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";

export const recipeAmuletOfDeath: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.AmuletOfDeath,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
      qty: 100,
    },
    {
      key: MagicsBlueprint.CorruptionRune,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.RedSapphire, 30],
      [CraftingResourcesBlueprint.Rope, 10],
      [CraftingResourcesBlueprint.Skull, 25],
      [MagicsBlueprint.CorruptionRune, 25],
      [CraftingResourcesBlueprint.DragonTooth, 10],
    ]),
  ],
};
