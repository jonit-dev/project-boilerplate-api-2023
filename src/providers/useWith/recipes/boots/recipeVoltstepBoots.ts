import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVoltstepBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.VoltstepBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 50,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 34],
};
// 34
