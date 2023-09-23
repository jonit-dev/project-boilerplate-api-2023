import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill, MagicsBlueprint } from "@rpg-engine/shared";

export const recipeBloodstoneAmulet: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.BloodstoneAmulet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Rope,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 80,
    },
    {
      key: MagicsBlueprint.DarkRune,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 100,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 40],
};
