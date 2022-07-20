import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemGreaterLifePotion } from "./ItemGreaterLifePotion";
import { itemLightAntidote } from "./ItemLightAntidote";
import { itemLightEndurancePotion } from "./ItemLightEndurancePotion";
import { itemLightLifePotion } from "./ItemLightLifePotion";
import { itemManaPotion } from "./ItemManaPotion";

export const potionsBlueprintsIndex = {
  [PotionsBlueprint.GreaterLifePotion]: itemGreaterLifePotion,
  [PotionsBlueprint.LightLifePotion]: itemLightLifePotion,
  [PotionsBlueprint.LightEndurancePotion]: itemLightEndurancePotion,
  [PotionsBlueprint.ManaPotion]: itemManaPotion,
  [PotionsBlueprint.LightAntidote]: itemLightAntidote,
};
