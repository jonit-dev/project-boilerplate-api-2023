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
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 3],
      [CraftingResourcesBlueprint.GreenIngot, 3],
      [CraftingResourcesBlueprint.WoodenSticks, 4],
      [CraftingResourcesBlueprint.PhoenixFeather, 4],
      [CraftingResourcesBlueprint.DragonHead, 1],
    ]),
  ],
};
