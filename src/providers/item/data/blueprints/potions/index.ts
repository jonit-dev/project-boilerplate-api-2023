import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemGreaterLifePotion } from "./ItemGreaterLifePotion";
import { itemGreaterManaPotion } from "./ItemGreaterManaPotion";
import { itemLifePotion } from "./ItemLifePotion";
import { itemLightAntidote } from "./ItemLightAntidote";
import { itemLightEndurancePotion } from "./ItemLightEndurancePotion";
import { itemLightLifePotion } from "./ItemLightLifePotion";
import { itemLightManaPotion } from "./ItemLightManaPotion";
import { itemManaPotion } from "./ItemManaPotion";

export const potionsBlueprintsIndex = {
  [PotionsBlueprint.GreaterLifePotion]: itemGreaterLifePotion,
  [PotionsBlueprint.LifePotion]: itemLifePotion,
  [PotionsBlueprint.LightLifePotion]: itemLightLifePotion,
  [PotionsBlueprint.LightManaPotion]: itemLightManaPotion,
  [PotionsBlueprint.LightEndurancePotion]: itemLightEndurancePotion,
  [PotionsBlueprint.ManaPotion]: itemManaPotion,
  [PotionsBlueprint.LightAntidote]: itemLightAntidote,
  [PotionsBlueprint.GreaterManaPotion]: itemGreaterManaPotion,
};
