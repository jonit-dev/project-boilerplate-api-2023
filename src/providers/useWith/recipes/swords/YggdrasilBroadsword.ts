import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeYggdrasilBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.YggdrasilBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.Bones,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ElvenWood, 100],
      [CraftingResourcesBlueprint.GoldenOre, 50],
      [CraftingResourcesBlueprint.Bones, 40],
      [CraftingResourcesBlueprint.WoodenSticks, 90],
      [CraftingResourcesBlueprint.IronIngot, 50],
    ]),
  ],
};
