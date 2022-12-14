import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWeaponRecipe: Partial<IItem> = {
  key: CraftingResourcesBlueprint.WeaponRecipe,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/weapon-recipe.png",
  name: "Weapon Recipe",
  description: "A weapon recipe scroll used for crafting.",
  weight: 1,
};
