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
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.DragonTooth, 5],
      [CraftingResourcesBlueprint.PhoenixFeather, 20],
      [CraftingResourcesBlueprint.ObsidiumIngot, 30],
      [CraftingResourcesBlueprint.GreenIngot, 30],
    ]),
  ],
};
