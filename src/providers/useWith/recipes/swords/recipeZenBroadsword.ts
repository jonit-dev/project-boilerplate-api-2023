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
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 50],
      [CraftingResourcesBlueprint.ElvenWood, 100],
      [CraftingResourcesBlueprint.ElvenLeaf, 100],
      [CraftingResourcesBlueprint.DragonHead, 3],
    ]),
  ],
};
