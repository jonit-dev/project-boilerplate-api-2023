import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { BooksBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeMysticWardenCodex: IUseWithCraftingRecipe = {
  outputKey: BooksBlueprint.MysticWardenCodex,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.PhoenixFeather, 2],
      [CraftingResourcesBlueprint.ElvenLeaf, 3],
      [CraftingResourcesBlueprint.BlueLeather, 1],
    ]),
  ],
};
