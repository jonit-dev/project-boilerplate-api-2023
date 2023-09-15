import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import { recipeAccessoriesIndex } from "../recipes/accessories/index";
import { recipeArmorsIndex } from "../recipes/armors/index";
import { recipeAxesIndex } from "../recipes/axes/index";
import { recipeBooksIndex } from "../recipes/books";
import { recipeBootsIndex } from "../recipes/boots/index";
import { recipeContainers } from "../recipes/containers";
import { recipeCraftingResources } from "../recipes/crafting-resources";
import { recipeDaggersIndex } from "../recipes/daggers/index";
import { recipeFoodsIndex } from "../recipes/foods/index";
import { recipeGlovesIndex } from "../recipes/gloves";
import { recipeHammersIndex } from "../recipes/hammers/index";
import { recipeHelmetsIndex } from "../recipes/helmets/index";
import { recipeLegsIndex } from "../recipes/legs/index";
import { recipeMacesIndex } from "../recipes/maces/index";
import { recipePotionsIndex } from "../recipes/potions";
import { recipeRangedIndex } from "../recipes/ranged-weapons/index";
import { recipeShieldsIndex } from "../recipes/shields/index";
import { recipeSpearsIndex } from "../recipes/spears/index";
import { recipeStaffsIndex } from "../recipes/staffs/index";
import { recipeSwordsIndex } from "../recipes/swords/index";

export const recipeBlueprintsIndex: IBlueprint = {
  ...recipeAccessoriesIndex,
  ...recipeArmorsIndex,
  ...recipeAxesIndex,
  ...recipeBooksIndex,
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
  ...recipeHammersIndex,
};
