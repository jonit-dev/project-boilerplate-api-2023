import { BooksBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBook } from "./ItemBook";

export const booksBlueprintIndex = {
  [BooksBlueprint.Book]: itemBook,
};
