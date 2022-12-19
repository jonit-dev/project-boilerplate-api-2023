import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFoodRecipe: Partial<IItem> = {
  key: CraftingResourcesBlueprint.FoodRecipe,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/food-recipe.png",
  name: "Food Recipe",
  description: "A food recipe scroll used for crafting.",
  weight: 1,
};