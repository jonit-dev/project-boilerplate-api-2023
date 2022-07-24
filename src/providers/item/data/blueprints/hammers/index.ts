import { HammersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemHammer } from "./ItemHammer";
import { itemIronHammer } from "./ItemIronHammer";
import { itemWarHammer } from "./ItemWarHammer";

export const hammersBlueprintIndex = {
  [HammersBlueprint.Hammer]: itemHammer,
  [HammersBlueprint.IronHammer]: itemIronHammer,
  [HammersBlueprint.WarHammer]: itemWarHammer,
};
