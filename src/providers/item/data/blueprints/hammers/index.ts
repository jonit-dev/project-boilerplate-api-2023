import { HammersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemIronHammer } from "./ItemIronHammer";
import { itemWarHammer } from "./ItemWarHammer";

export const hammersBlueprintIndex = {
  [HammersBlueprint.IronHammer]: itemIronHammer,
  [HammersBlueprint.WarHammer]: itemWarHammer,
};
