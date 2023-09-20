import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeEtherealEmbrace: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.EtherealEmbrace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 70,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ElvenWood, 60],
      [CraftingResourcesBlueprint.Feather, 80],
      [CraftingResourcesBlueprint.BlueSilk, 80],
      [CraftingResourcesBlueprint.Jade, 70],
    ]),
  ],
};
