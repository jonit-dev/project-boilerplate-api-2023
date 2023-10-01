import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeTungstenSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.TungstenSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 5],
      [CraftingResourcesBlueprint.GreenIngot, 4],
      [CraftingResourcesBlueprint.WoodenSticks, 10],
      [CraftingResourcesBlueprint.PhoenixFeather, 10],
    ]),
  ],
};
