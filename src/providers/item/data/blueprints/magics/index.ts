import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBook } from "./ItemBook";
import { itemRune } from "./ItemRune";

export const magicsBlueprintIndex = {
  [MagicsBlueprint.Rune]: itemRune,
  [MagicsBlueprint.Book]: itemBook,
};
