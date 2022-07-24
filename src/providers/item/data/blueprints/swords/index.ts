import { SwordBlueprint } from "../../types/itemsBlueprintTypes";
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
  [SwordBlueprint.ShortSword]: itemShortSword,
  [SwordBlueprint.BasiliskSword]: itemBasiliskSword,
  [SwordBlueprint.DragonsSword]: itemDragonsSword,
  [SwordBlueprint.DoubleEdgedSword]: itemDoubleEdgedSword,
  [SwordBlueprint.BroadSword]: itemBroadSword,
  [SwordBlueprint.ElvenSword]: itemElvenSword,
  [SwordBlueprint.Katana]: itemKatana,
  [SwordBlueprint.KnightsSword]: itemKnightsSword,
  [SwordBlueprint.FireSword]: itemFireSword,
};
