import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeAmuletOfDeath: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.AmuletOfDeath,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.Skull,
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
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 50,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 30],
};
