import { SwordBlueprint } from "../../types/blueprintTypes";
import { itemBasiliskSword } from "./ItemBasiliskSword";
import { itemShortSword } from "./ItemShortSword";

export const swordBlueprintIndex = {
  [SwordBlueprint.ShortSword]: itemShortSword,
  [SwordBlueprint.BasiliskSword]: itemBasiliskSword,
};
