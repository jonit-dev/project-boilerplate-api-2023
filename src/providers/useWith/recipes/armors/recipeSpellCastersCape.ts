import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSpellcastersCape: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.SpellcastersCape,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 40,
    },

    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 45,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 40,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CorruptionIngot, 40],

      [CraftingResourcesBlueprint.BlueSilk, 40],
      [CraftingResourcesBlueprint.BlueSapphire, 45],
      [CraftingResourcesBlueprint.PhoenixFeather, 40],
    ]),
  ],
};
