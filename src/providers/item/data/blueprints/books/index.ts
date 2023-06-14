import { BooksBlueprint } from "../../types/itemsBlueprintTypes";
import { itemArcaneArbiterChronicles } from "./ItemArcaneArbiterChronicles";
import { itemBook } from "./ItemBook";
import { itemEmberSageScripture } from "./ItemEmberSageScripture";
import { itemFrostWraithTome } from "./ItemFrostWraithTome";
import { itemMysticWardenCodex } from "./ItemMysticWardenCodex";
import { itemStormbringerGrimoire } from "./ItemStormbringerGrimoire";

export const booksBlueprintIndex = {
  [BooksBlueprint.Book]: itemBook,
  [BooksBlueprint.ArcaneArbiterChronicles]: itemArcaneArbiterChronicles,
  [BooksBlueprint.EmberSageScripture]: itemEmberSageScripture,
  [BooksBlueprint.FrostWraithTome]: itemFrostWraithTome,
  [BooksBlueprint.MysticWardenCodex]: itemMysticWardenCodex,
  [BooksBlueprint.StormbringerGrimoire]: itemStormbringerGrimoire,
};
