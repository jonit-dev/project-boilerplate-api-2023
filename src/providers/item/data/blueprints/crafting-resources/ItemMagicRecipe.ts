import { ICraftableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMagicRecipe: ICraftableItemBlueprint = {
  key: CraftingResourcesBlueprint.MagicRecipe,
  type: ItemType.CraftingResource,
  subType: ItemSubType.CraftingResource,
  textureAtlas: "items",
  texturePath: "crafting-resources/magic-recipe.png",
  name: "Magic Recipe",
  description: "A magic recipe scroll used for crafting.",
  weight: 0.01,
  maxStackSize: 100,
};
