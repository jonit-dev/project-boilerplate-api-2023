import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFoodRecipe: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.FoodRecipe,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/food-recipe.png",
  name: "Food Recipe",
  description: "A food recipe scroll used for crafting.",
  weight: 1,
  basePrice: 10,
  maxStackSize: 100,
};
