import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGuardianGlaive: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.GuardianGlaive,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.IronNail,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Lumberjacking, 35],
};
