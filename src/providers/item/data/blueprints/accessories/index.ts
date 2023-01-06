import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBandana } from "./ItemBandana";
import { itemCorruptionNecklace } from "./ItemCorruptionNecklace";
import { itemDeathNecklace } from "./ItemDeathNecklace";
import { itemElvenRing } from "./ItemElvenRing";
import { itemGoldenRing } from "./ItemGoldenRing";
import { itemHasteRing } from "./ItemHasteRing";
import { itemIronRing } from "./ItemIronRing";
import { itemJadeRing } from "./ItemJadeRing";
import { itemOrcRing } from "./ItemOrcRing";
import { itemRubyRing } from "./ItemRubyRing";
import { itemSapphireRing } from "./ItemSapphireRing";
import { itemSilverKey } from "./itemSilverKey";
import { itemSoldiersRing } from "./ItemSoldiersRing";

export const accessoriesBlueprintsIndex = {
  [AccessoriesBlueprint.SilverKey]: itemSilverKey,
  [AccessoriesBlueprint.CorruptionNecklace]: itemCorruptionNecklace,
  [AccessoriesBlueprint.DeathNecklace]: itemDeathNecklace,
  [AccessoriesBlueprint.Bandana]: itemBandana,
  [AccessoriesBlueprint.ElvenRing]: itemElvenRing,
  [AccessoriesBlueprint.GoldenRing]: itemGoldenRing,
  [AccessoriesBlueprint.HasteRing]: itemHasteRing,
  [AccessoriesBlueprint.IronRing]: itemIronRing,
  [AccessoriesBlueprint.JadeRing]: itemJadeRing,
  [AccessoriesBlueprint.OrcRing]: itemOrcRing,
  [AccessoriesBlueprint.RubyRing]: itemRubyRing,
  [AccessoriesBlueprint.SapphireRing]: itemSapphireRing,
  [AccessoriesBlueprint.SoldiersRing]: itemSoldiersRing,
};
