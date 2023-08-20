import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";

export const recipeAmuletOfDeath: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.AmuletOfDeath,
  outputQtyRange: [1, 1],
  requiredItems: [
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
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 100,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Rope, 10],
      [CraftingResourcesBlueprint.Skull, 100],
      [MagicsBlueprint.CorruptionRune, 100],
      [CraftingResourcesBlueprint.BlueSapphire, 100],
      [CraftingResourcesBlueprint.RedSapphire, 100],
      [CraftingResourcesBlueprint.CorruptionOre, 100],
      [CraftingResourcesBlueprint.Jade, 100],
      [CraftingResourcesBlueprint.PhoenixFeather, 100],
    ]),
  ],
};
