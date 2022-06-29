import { BowsBlueprint } from "../../types/blueprintTypes";
import { itemArrow } from "./ItemArrow";
import { itemBolt } from "./ItemBolt";

export const bowsBlueprintIndex = {
  [BowsBlueprint.Arrow]: itemArrow,
  [BowsBlueprint.Bolt]: itemBolt,
};
