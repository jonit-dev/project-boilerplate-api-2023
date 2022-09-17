import { RangedBlueprint } from "../../types/itemsBlueprintTypes";
import { itemArrow } from "./ItemArrow";
import { itemBolt } from "./ItemBolt";
import { itemBow } from "./ItemBow";

export const bowsBlueprintIndex = {
  [RangedBlueprint.Arrow]: itemArrow,
  [RangedBlueprint.Bolt]: itemBolt,
  [RangedBlueprint.Bow]: itemBow,
};
