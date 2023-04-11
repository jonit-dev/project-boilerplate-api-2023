import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWhiteDragonSpear: IUseWithCraftingRecipe = {
  outputKey: SpearsBlueprint.WhiteDragonSpear,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.DragonTooth, 5],
      [CraftingResourcesBlueprint.PhoenixFeather, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 10],
    ]),
  ],
};
