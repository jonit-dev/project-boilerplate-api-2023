import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGlacialArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.GlacialArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueLeather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 25,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueLeather, 20],
      [CraftingResourcesBlueprint.BlueSapphire, 20],
      [CraftingResourcesBlueprint.SteelIngot, 25],
    ]),
  ],
};
