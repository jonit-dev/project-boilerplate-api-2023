import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeGhostTalonSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.GhostTalonSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 6,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 20],
      [CraftingResourcesBlueprint.Eye, 20],
      [CraftingResourcesBlueprint.Leather, 20],
      [CraftingResourcesBlueprint.DragonHead, 6],
    ]),
  ],
};
