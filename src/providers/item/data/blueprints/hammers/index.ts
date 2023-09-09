import { HammersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemIronHammer } from "./tier0/ItemIronHammer";
import { itemDragonFistHammer } from "./tier10/ItemDragonFistHammer";
import { itemGoldHammer } from "./tier11/ItemGoldHammer";
import { itemSilverHammer } from "./tier3/ItemSilverHammer";
import { itemWarHammer } from "./tier3/ItemWarHammer";
import { itemRoyalHammer } from "./tier4/ItemRoyalHammer";
import { itemSledgeHammer } from "./tier7/ItemSledgeHammer";
import { itemThorHammer } from "./tier8/ItemThorHammer";
import { itemMedievalCrossedHammer } from "./tier9/ItemMedievalCrossedHammer";

export const hammersBlueprintIndex = {
  [HammersBlueprint.IronHammer]: itemIronHammer,
  [HammersBlueprint.WarHammer]: itemWarHammer,
  [HammersBlueprint.SilverHammer]: itemSilverHammer,
  [HammersBlueprint.RoyalHammer]: itemRoyalHammer,
  [HammersBlueprint.MedievalCrossedHammer]: itemMedievalCrossedHammer,
  [HammersBlueprint.SledgeHammer]: itemSledgeHammer,
  [HammersBlueprint.ThorHammer]: itemThorHammer,
  [HammersBlueprint.GoldHammer]: itemGoldHammer,
  [HammersBlueprint.DragonFistHammer]: itemDragonFistHammer,
};
