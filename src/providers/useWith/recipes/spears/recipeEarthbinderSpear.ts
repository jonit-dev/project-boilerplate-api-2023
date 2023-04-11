import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeEarthbinderSpear: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.EarthbinderSpear,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 3],
      [CraftingResourcesBlueprint.IronIngot, 3],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
    ]),
  ],
};
