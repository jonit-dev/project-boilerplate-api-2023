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
  const minimumLevelLinear = (totalIngredientValue * CRAFTING_MIN_LEVEL_RATIO) / 100;
  const minimumLevelLogarithmic = Math.log(totalIngredientValue + 1) * CRAFTING_MIN_LEVEL_RATIO;

  const minimumLevel = Math.min(minimumLevelLinear, minimumLevelLogarithmic);

  // Return the smallest integer greater than or equal to the minimumLevel
  return Math.ceil(minimumLevel);
}
