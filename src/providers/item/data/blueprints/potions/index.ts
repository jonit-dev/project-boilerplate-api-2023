import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAcidFlask } from "./ItemAcidFlask";
import { itemBlazingFirebomb } from "./ItemBlazingFirebomb";
import { itemCorrosiveElixir } from "./ItemCorrosiveElixir";
import { itemFieryConcussion } from "./ItemFieryConcussion";
import { itemGreaterLifePotion } from "./ItemGreaterLifePotion";
import { itemGreaterManaPotion } from "./ItemGreaterManaPotion";
import { itemLifePotion } from "./ItemLifePotion";
import { itemLightAntidote } from "./ItemLightAntidote";
import { itemLightEndurancePotion } from "./ItemLightEndurancePotion";
import { itemLightLifePotion } from "./ItemLightLifePotion";
import { itemLightManaPotion } from "./ItemLightManaPotion";
import { itemManaPotion } from "./ItemManaPotion";
import { itemVenomousVial } from "./ItemVenomousVial";

export const potionsBlueprintsIndex = {
  [PotionsBlueprint.GreaterLifePotion]: itemGreaterLifePotion,
  [PotionsBlueprint.LifePotion]: itemLifePotion,
  [PotionsBlueprint.LightLifePotion]: itemLightLifePotion,
  [PotionsBlueprint.LightManaPotion]: itemLightManaPotion,
  [PotionsBlueprint.LightEndurancePotion]: itemLightEndurancePotion,
  [PotionsBlueprint.ManaPotion]: itemManaPotion,
  [PotionsBlueprint.LightAntidote]: itemLightAntidote,
  [PotionsBlueprint.GreaterManaPotion]: itemGreaterManaPotion,
  [PotionsBlueprint.BlazingFirebomb]: itemBlazingFirebomb,
  [PotionsBlueprint.FieryConcussion]: itemFieryConcussion,
  [PotionsBlueprint.AcidFlask]: itemAcidFlask,
  [PotionsBlueprint.CorrosiveElixir]: itemCorrosiveElixir,
  [PotionsBlueprint.VenomousVial]: itemVenomousVial,
};
