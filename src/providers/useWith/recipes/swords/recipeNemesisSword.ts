import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeNemesisSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.NemesisSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 16,
    },
    {
      key: CraftingResourcesBlueprint.WeaponRecipe,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 19,
    },
    {
      key: CraftingResourcesBlueprint.DragonTooth,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 16],
      [CraftingResourcesBlueprint.WeaponRecipe, 5],
      [CraftingResourcesBlueprint.Leather, 19],
      [CraftingResourcesBlueprint.DragonHead, 3],
    ]),
  ],
};
