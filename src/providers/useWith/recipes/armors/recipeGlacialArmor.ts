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
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueLeather, 15],
      [CraftingResourcesBlueprint.BlueSapphire, 15],
      [CraftingResourcesBlueprint.SteelIngot, 20],
    ]),
  ],
};
