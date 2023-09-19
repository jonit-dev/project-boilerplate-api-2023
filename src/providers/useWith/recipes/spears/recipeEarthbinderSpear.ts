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
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 30],
      [CraftingResourcesBlueprint.PolishedStone, 30],
      [CraftingResourcesBlueprint.Herb, 30],
      [CraftingResourcesBlueprint.WoodenBoard, 30],
    ]),
  ],
};
