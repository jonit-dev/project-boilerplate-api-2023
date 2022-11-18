import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBook } from "./ItemBook";
import { itemDarkRune } from "./ItemDarkRune";
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
  [MagicsBlueprint.Book]: itemBook,
};
