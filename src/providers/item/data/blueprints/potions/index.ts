import { PotionsBlueprint } from "../../types/blueprintTypes";
import { itemGreaterLifePotion } from "./ItemGreaterLifePotion";
import { itemLightLifePotion } from "./ItemLightLifePotion";
import { itemLightEndurancePotion } from "./ItemLightEndurancePotion";
import { itemManaPotion } from "./ItemManaPotion";

export const potionsBlueprintsIndex = {
  [PotionsBlueprint.GreaterLifePotion]: itemGreaterLifePotion,
  [PotionsBlueprint.LightLifePotion]: itemLightLifePotion,
  [PotionsBlueprint.LightEndurancePotion]: itemLightEndurancePotion,
  [PotionsBlueprint.ManaPotion]: itemManaPotion,
};
