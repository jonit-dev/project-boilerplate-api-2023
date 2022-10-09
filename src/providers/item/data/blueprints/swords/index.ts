import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBasiliskSword } from "./ItemBasiliskSword";
import { itemBroadSword } from "./ItemBroadSword";
import { itemDoubleEdgedSword } from "./ItemDoubleEdgedSword";
import { itemDragonsSword } from "./ItemDragonsSword";
import { itemElvenSword } from "./ItemElvenSword";
import { itemFireSword } from "./ItemFireSword";
import { itemKatana } from "./ItemKatana";
import { itemKnightsSword } from "./ItemKnightsSword";
import { itemShortSword } from "./ItemShortSword";

export const swordBlueprintIndex = {
  [SwordsBlueprint.ShortSword]: itemShortSword,
  [SwordsBlueprint.BasiliskSword]: itemBasiliskSword,
  [SwordsBlueprint.DragonsSword]: itemDragonsSword,
  [SwordsBlueprint.DoubleEdgedSword]: itemDoubleEdgedSword,
  [SwordsBlueprint.BroadSword]: itemBroadSword,
  [SwordsBlueprint.ElvenSword]: itemElvenSword,
  [SwordsBlueprint.Katana]: itemKatana,
  [SwordsBlueprint.KnightsSword]: itemKnightsSword,
  [SwordsBlueprint.FireSword]: itemFireSword,
};
