import { IUseWithCraftingRecipe } from "../useWithTypes";
import { recipeAccessoriesIndex } from "./accessories/index";
import { recipeArmorsIndex } from "./armors/index";
import { recipeAxesIndex } from "./axes/index";
import { recipeBootsIndex } from "./boots/index";
import { recipeContainers } from "./containers";
import { recipeCraftingResources } from "./crafting-resources";
import { recipeDaggersIndex } from "./daggers/index";
import { recipeFoodsIndex } from "./foods/index";
import { recipeGlovesIndex } from "./gloves";
import { recipeHelmetsIndex } from "./helmets/index";
import { recipeLegsIndex } from "./legs/index";
import { recipeMacesIndex } from "./maces/index";
import { recipePotionsIndex } from "./potions";
import { recipeRangedIndex } from "./ranged-weapons/index";
import { recipeShieldsIndex } from "./shields/index";
import { recipeSpearsIndex } from "./spears/index";
import { recipeStaffsIndex } from "./staffs/index";
import { recipeSwordsIndex } from "./swords/index";

export const recipeBlueprintsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  ...recipeAccessoriesIndex,
  ...recipeArmorsIndex,
  ...recipeAxesIndex,
  ...recipeBootsIndex,
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
  ...recipeCraftingResources,
  ...recipeContainers,
  ...recipePotionsIndex,
  ...recipeGlovesIndex,
};
