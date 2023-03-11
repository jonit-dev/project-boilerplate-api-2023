import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAmazonsNecklace } from "./ItemAmazonsNecklace";
import { itemAmuletOfDeath } from "./ItemAmuletOfDeath";
import { itemAmuletOfLuck } from "./ItemAmuletOfLuck";
import { itemBandana } from "./ItemBandana";
import { itemCorruptionNecklace } from "./ItemCorruptionNecklace";
import { itemDeathNecklace } from "./ItemDeathNecklace";
import { itemElvenRing } from "./ItemElvenRing";
import { itemFalconsRing } from "./ItemFalconsRing";
import { itemGlacialRing } from "./ItemGlacialRing";
import { itemGoldenRing } from "./ItemGoldenRing";
import { itemHasteRing } from "./ItemHasteRing";
import { itemIronRing } from "./ItemIronRing";
import { itemJadeRing } from "./ItemJadeRing";
import { itemOrcRing } from "./ItemOrcRing";
import { itemPendantOfLife } from "./ItemPendantOfLife";
import { itemRoyalBracelet } from "./ItemRoyalBracelet";
import { itemRubyRing } from "./ItemRubyRing";
import { itemSapphireNecklace } from "./ItemSapphireNecklace";
import { itemSapphireRing } from "./ItemSapphireRing";
import { itemSilverKey } from "./itemSilverKey";
import { itemSoldiersRing } from "./ItemSoldiersRing";
import { itemStarNecklace } from "./ItemStarNecklace";
import { itemWolfToothChain } from "./ItemWolfToothChain";

export const accessoriesBlueprintIndex = {
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
  [AccessoriesBlueprint.AmazonsNecklace]: itemAmazonsNecklace,
  [AccessoriesBlueprint.RoyalBracelet]: itemRoyalBracelet,
  [AccessoriesBlueprint.SapphireNecklace]: itemSapphireNecklace,
  [AccessoriesBlueprint.StarNecklace]: itemStarNecklace,
  [AccessoriesBlueprint.WolfToothChain]: itemWolfToothChain,
  [AccessoriesBlueprint.AmuletOfDeath]: itemAmuletOfDeath,
  [AccessoriesBlueprint.AmuletOfLuck]: itemAmuletOfLuck,
  [AccessoriesBlueprint.PendantOfLife]: itemPendantOfLife,
  [AccessoriesBlueprint.FalconsRing]: itemFalconsRing,
  [AccessoriesBlueprint.GlacialRing]: itemGlacialRing,
};
