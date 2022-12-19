import { IUseWithCraftingRecipe } from "../useWithTypes";
import { recipeAccssoriesIndex } from "./accessories/index";
import { recipeArmorsIndex } from "./armors/index";
import { recipeAxesIndex } from "./axes/index";
import { recipeBootsIndex } from "./boots/index";
import { recipeCraftingsIndex } from "./crafting-resources/index";
import { recipeDaggersIndex } from "./daggers/index";
import { recipeFoodsIndex } from "./foods/index";
import { recipeHelmetsIndex } from "./helmets/index";
import { recipeLegsIndex } from "./legs/index";
import { recipeMacesIndex } from "./maces/index";
import { recipeRangedIndex } from "./ranged-weapons/index";
import { recipeShieldsIndex } from "./shields/index";
import { recipeSpearsIndex } from "./spears/index";
import { recipeStaffsIndex } from "./staffs/index";
import { recipeSwordsIndex } from "./swords/index";

export const recipeBlueprintsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  ...recipeAccssoriesIndex,
  ...recipeArmorsIndex,
  ...recipeAxesIndex,
  ...recipeBootsIndex,
  ...recipeCraftingsIndex,
  ...recipeDaggersIndex,
  ...recipeFoodsIndex,
  ...recipeHelmetsIndex,
  ...recipeLegsIndex,
  ...recipeMacesIndex,
  ...recipeRangedIndex,
  ...recipeShieldsIndex,
  ...recipeSpearsIndex,
  ...recipeStaffsIndex,
  ...recipeSwordsIndex,
};