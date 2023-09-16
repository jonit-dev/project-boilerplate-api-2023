import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVenomStrikeSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.VenomStrikeSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 30,
    },
    {
      key: MagicsBlueprint.PoisonRune,
      qty: 100,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreenIngot, 50],
      [CraftingResourcesBlueprint.Herb, 100],
      [CraftingResourcesBlueprint.SteelIngot, 30],
      [MagicsBlueprint.PoisonRune, 100],
    ]),
  ],
};
