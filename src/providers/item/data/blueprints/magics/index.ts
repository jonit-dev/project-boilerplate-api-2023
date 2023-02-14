import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCorruptionRune } from "./ItemCorruptionRune";
import { itemDarkRune } from "./ItemDarkRune";
import { itemEnergyBoltRune } from "./itemEnergyBoltRune";
import { itemFireBoltRune } from "./itemFireBoltRune";
import { itemFireRune } from "./ItemFireRune";
import { itemHealRune } from "./ItemHealRune";
import { itemPoisonRune } from "./ItemPoisonRune";
import { itemRune } from "./ItemRune";

export const magicsBlueprintIndex = {
  [MagicsBlueprint.Rune]: itemRune,
  [MagicsBlueprint.DarkRune]: itemDarkRune,
  [MagicsBlueprint.FireRune]: itemFireRune,
  [MagicsBlueprint.HealRune]: itemHealRune,
  [MagicsBlueprint.PoisonRune]: itemPoisonRune,
  [MagicsBlueprint.EnergyBoltRune]: itemEnergyBoltRune,
  [MagicsBlueprint.FireBoltRune]: itemFireBoltRune,
  [MagicsBlueprint.CorruptionRune]: itemCorruptionRune,
};
