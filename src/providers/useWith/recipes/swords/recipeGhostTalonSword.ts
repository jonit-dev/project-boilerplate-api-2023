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
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Eye,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.DragonHead,
      qty: 6,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumIngot, 80],
      [CraftingResourcesBlueprint.Eye, 100],
      [CraftingResourcesBlueprint.WoodenBoard, 100],
      [CraftingResourcesBlueprint.DragonHead, 6],
    ]),
  ],
};
