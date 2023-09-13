import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeZenBroadsword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.ZenBroadsword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 19,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 114,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 9,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 19],
      [CraftingResourcesBlueprint.ElvenWood, 11],
      [CraftingResourcesBlueprint.ElvenLeaf, 10],
      [CraftingResourcesBlueprint.DragonHead, 9],
    ]),
  ],
};
