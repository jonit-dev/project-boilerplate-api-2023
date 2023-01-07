import { HammersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemIronHammer } from "./ItemIronHammer";
import { itemRoyalHammer } from "./ItemRoyalHammer";
import { itemSilverHammer } from "./ItemSilverHammer";
import { itemWarHammer } from "./ItemWarHammer";

export const hammersBlueprintIndex = {
  [HammersBlueprint.IronHammer]: itemIronHammer,
  [HammersBlueprint.WarHammer]: itemWarHammer,
  [HammersBlueprint.SilverHammer]: itemSilverHammer,
  [HammersBlueprint.RoyalHammer]: itemRoyalHammer,
};
