import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCrownArmor: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.CrownArmor,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 60,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 70,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 45,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 60],
      [CraftingResourcesBlueprint.GoldenIngot, 60],
      [CraftingResourcesBlueprint.PhoenixFeather, 70],
      [CraftingResourcesBlueprint.RedSapphire, 45],
    ]),
  ],
};
