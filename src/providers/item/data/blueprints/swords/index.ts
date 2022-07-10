import { SwordBlueprint } from "../../types/blueprintTypes";
import { itemBasiliskSword } from "./ItemBasiliskSword";
import { itemShortSword } from "./ItemShortSword";
import { itemDragonsSword } from "./ItemDragonsSword";
import { itemDoubleEdgedSword } from "./ItemDoubleEdgedSword";
import { itemBroadSword } from "./ItemBroadSword";

export const swordBlueprintIndex = {
  [SwordBlueprint.ShortSword]: itemShortSword,
  [SwordBlueprint.BasiliskSword]: itemBasiliskSword,
  [SwordBlueprint.DragonsSword]: itemDragonsSword,
  [SwordBlueprint.DoubleEdgedSword]: itemDoubleEdgedSword,
  [SwordBlueprint.BroadSword]: itemBroadSword,
};
