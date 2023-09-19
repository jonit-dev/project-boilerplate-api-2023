import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeKnightArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.KnightArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 20],
      [CraftingResourcesBlueprint.ObsidiumIngot, 5],
      [CraftingResourcesBlueprint.Leather, 10],
    ]),
  ],
};
