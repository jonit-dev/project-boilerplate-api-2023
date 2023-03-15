import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWeaponRecipe: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.WeaponRecipe,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/weapon-recipe.png",
  name: "Weapon Recipe",
  description: "A weapon recipe scroll used for crafting.",
  weight: 0.6,
};
