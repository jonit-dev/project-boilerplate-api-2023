import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCavalierBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.CavalierBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 30,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 28],
};
