import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemSilverKey } from "./itemSilverKey";
import { itemAmazonsNecklace } from "./tier0/ItemAmazonsNecklace";
import { itemAmuletOfDeath } from "./tier0/ItemAmuletOfDeath";
import { itemAmuletOfLuck } from "./tier0/ItemAmuletOfLuck";
import { itemBandana } from "./tier0/ItemBandana";
import { itemCorruptionNecklace } from "./tier0/ItemCorruptionNecklace";
import { itemDeathNecklace } from "./tier0/ItemDeathNecklace";
import { itemElvenRing } from "./tier0/ItemElvenRing";
import { itemPendantOfLife } from "./tier0/ItemPendantOfLife";
import { itemRoyalBracelet } from "./tier0/ItemRoyalBracelet";
import { itemSapphireNecklace } from "./tier0/ItemSapphireNecklace";
import { itemStarNecklace } from "./tier0/ItemStarNecklace";
import { itemWolfToothChain } from "./tier0/ItemWolfToothChain";
import { itemFalconsRing } from "./tier1/ItemFalconsRing";
import { itemGlacialRing } from "./tier1/ItemGlacialRing";
import { itemHasteRing } from "./tier1/ItemHasteRing";
import { itemIronRing } from "./tier1/ItemIronRing";
import { itemOrcRing } from "./tier1/ItemOrcRing";
import { itemSoldiersRing } from "./tier1/ItemSoldiersRing";
import { itemBloodstoneAmulet } from "./tier13/ItemBloodstoneAmulet";
import { itemForestHeartPendant } from "./tier15/ItemForestHeartPendant";
import { itemEmeraldEleganceNecklace } from "./tier17/ItemEmeraldEleganceNecklace";
import { itemGoldenRing } from "./tier2/ItemGoldenRing";
import { itemJadeRing } from "./tier2/ItemJadeRing";
import { itemRubyRing } from "./tier2/ItemRubyRing";
import { itemSapphireRing } from "./tier2/ItemSapphireRing";

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
  [AccessoriesBlueprint.BloodstoneAmulet]: itemBloodstoneAmulet,
  [AccessoriesBlueprint.ForestHeartPendant]: itemForestHeartPendant,
  [AccessoriesBlueprint.EmeraldEleganceNecklace]: itemEmeraldEleganceNecklace,
};
