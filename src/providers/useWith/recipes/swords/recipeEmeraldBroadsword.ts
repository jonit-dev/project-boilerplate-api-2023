import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeEmeraldBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.EmeraldBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 160,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 9,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenIngot, 50],
      [CraftingResourcesBlueprint.Herb, 160],
      [CraftingResourcesBlueprint.WoodenBoard, 80],
      [CraftingResourcesBlueprint.Jade, 90],
      [CraftingResourcesBlueprint.ElvenLeaf, 100],
      [CraftingResourcesBlueprint.DragonTooth, 9],
    ]),
  ],
};
