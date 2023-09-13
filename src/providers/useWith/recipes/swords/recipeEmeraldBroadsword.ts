import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeEmeraldBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.EmeraldBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 19,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 16,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 14,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 9,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenOre, 19],
      [CraftingResourcesBlueprint.Herb, 16],
      [CraftingResourcesBlueprint.Leather, 14],
      [CraftingResourcesBlueprint.Jade, 9],
      [CraftingResourcesBlueprint.ElvenLeaf, 10],
      [CraftingResourcesBlueprint.DragonTooth, 9],
    ]),
  ],
};
