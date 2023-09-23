import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";

export const recipeEmeraldEleganceNecklace: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.EmeraldEleganceNecklace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 100,
    },
    {
      key: MagicsBlueprint.Rune,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 58],
};
