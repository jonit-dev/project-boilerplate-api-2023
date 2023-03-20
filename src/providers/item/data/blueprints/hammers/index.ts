import { HammersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemIronHammer } from "./tier0/ItemIronHammer";
import { itemSilverHammer } from "./tier3/ItemSilverHammer";
import { itemWarHammer } from "./tier3/ItemWarHammer";
import { itemRoyalHammer } from "./tier4/ItemRoyalHammer";

export const hammersBlueprintIndex = {
  [HammersBlueprint.IronHammer]: itemIronHammer,
  [HammersBlueprint.WarHammer]: itemWarHammer,
  [HammersBlueprint.SilverHammer]: itemSilverHammer,
  [HammersBlueprint.RoyalHammer]: itemRoyalHammer,
};
