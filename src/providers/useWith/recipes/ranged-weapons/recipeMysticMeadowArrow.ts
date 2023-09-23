import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeMysticMeadowArrow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.MysticMeadowArrow,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.Feather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, 42],
};
