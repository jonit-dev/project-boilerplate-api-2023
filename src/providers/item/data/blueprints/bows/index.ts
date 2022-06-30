import { BowsBlueprint } from "../../types/blueprintTypes";
import { itemArrow } from "./ItemArrow";
import { itemBolt } from "./ItemBolt";
import { itemBow } from "./ItemBow";

export const bowsBlueprintIndex = {
  [BowsBlueprint.Arrow]: itemArrow,
  [BowsBlueprint.Bolt]: itemBolt,
  [BowsBlueprint.Bow]: itemBow,
};
