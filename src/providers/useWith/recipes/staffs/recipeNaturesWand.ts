import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeNaturesWand: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.NaturesWand,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 11,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 18,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ElvenWood, 11],
      [CraftingResourcesBlueprint.Herb, 18],
      [CraftingResourcesBlueprint.MagicRecipe, 2],
    ]),
  ],
};
