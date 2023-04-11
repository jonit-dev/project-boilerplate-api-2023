import { CRAFTING_MIN_LEVEL_RATIO } from "@providers/constants/CraftingConstants";
import { itemsBlueprintIndex } from "@providers/item/data";

export function calculateMinimumLevel(ingredients: [string, number][]): number {
  let totalIngredientValue = 0;

  // Calculate the total value of ingredients
  ingredients.forEach(([itemID, qty]) => {
    const item = itemsBlueprintIndex[itemID];
    totalIngredientValue += item.basePrice * qty;
  });

  // Compute the minimum level using the total value of ingredients and the craftingConst
  const minimumLevel = (totalIngredientValue * CRAFTING_MIN_LEVEL_RATIO) / 100;

  // Return the smallest integer greater than or equal to the minimumLevel
  return Math.ceil(minimumLevel);
}
