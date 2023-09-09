import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemJianSword } from "./ItemJianSword";
import { itemRoyalSword } from "./ItemRoyalSword";
import { itemTemplarSword } from "./ItemTemplarSword";
import { itemYggdrasilGladius } from "./ItemYggdrasilGladius";
import { itemYggdrasilJianSword } from "./ItemYggdrasilJianSword";
import { itemYggdrasilTemplarSword } from "./ItemYggdrasilTemplarSword";
import { itemSword } from "./tier0/ItemSword";
import { itemWoodenSword } from "./tier0/ItemWoodenSword";
import { itemBroadSword } from "./tier1/ItemBroadSword";
import { itemElvenSword } from "./tier1/ItemElvenSword";
import { itemIronwoodTanto } from "./tier1/ItemIronwoodTanto";
import { itemKatana } from "./tier1/ItemKatana";
import { itemShortSword } from "./tier1/ItemShortSword";
import { itemDiamondSword } from "./tier10/ItemDiamondSword";
import { itemElucidatorSword } from "./tier10/ItemElucidatorSword";
import { itemGuardianSword } from "./tier10/ItemGuardianSword";
import { itemRoyalGuardianSword } from "./tier10/ItemRoyalGuardianSword";
import { itemTitaniumBroadsword } from "./tier10/ItemTitaniumBroadsword";
import { itemVioletVenomSword } from "./tier10/ItemVioletVenomSword";
import { itemAngelicSword } from "./tier11/ItemAngelicSword";
import { itemHellfireEdgeSword } from "./tier11/ItemHellfireEdgeSword";
import { itemInfernoEdgeSword } from "./tier11/ItemInfernoEdgeSword";
import { itemMinotaurSword } from "./tier11/ItemMinotaurSword";
import { itemNemesisSword } from "./tier11/ItemNemesisSword";
import { itemEmeraldBroadsword } from "./tier12/ItemEmeraldBroadsword";
import { itemGhostTalonSword } from "./tier12/ItemGhostTalonSword";
import { itemPhoenixSword } from "./tier12/ItemPhoenixSword";
import { itemWarlordBroadsword } from "./tier12/ItemWarlordBroadsword";
import { itemZenBroadsword } from "./tier12/ItemZenBroadsword";
import { itemCopperBroadsword } from "./tier2/ItemCopperBroadsword";
import { itemDoubleEdgedSword } from "./tier2/ItemDoubleEdgedSword";
import { itemIceSword } from "./tier2/ItemIceSword";
import { itemLongSword } from "./tier2/ItemLongSword";
import { itemRapier } from "./tier2/ItemRapier";
import { itemSaber } from "./tier2/ItemSaber";
import { itemAzureMachete } from "./tier3/ItemAzureMachete";
import { itemBasiliskSword } from "./tier3/ItemBasiliskSword";
import { itemCorruptionSword } from "./tier3/ItemCorruptionSword";
import { itemDamascusSword } from "./tier3/ItemDamascusSword";
import { itemFrostbiteBlade } from "./tier3/ItemFrostbiteBlade";
import { itemFrostguardSword } from "./tier3/ItemFrostguardSword";
import { itemKnightsSword } from "./tier3/ItemKnightsSword";
import { itemLightingSword } from "./tier3/ItemLightingSword";
import { itemShadowSword } from "./tier3/ItemShadowSword";
import { itemEldensSword } from "./tier4/ItemEldensSword";
import { itemEnchantedSword } from "./tier4/ItemEnchantedSword";
import { itemFalconsSword } from "./tier4/ItemFalconsSword";
import { itemFireSword } from "./tier4/ItemFireSword";
import { itemGlacialSword } from "./tier4/ItemGlacialSword";
import { itemIceShardLongsword } from "./tier4/ItemIceShardLongsword";
import { itemMithrilSword } from "./tier4/ItemMithrilSword";
import { itemPoisonSword } from "./tier4/ItemPoisonSword";
import { itemTungstenSword } from "./tier4/ItemTungstenSword";
import { itemCopperveinBlade } from "./tier5/ItemCopperveinBlade";
import { itemDragonsSword } from "./tier5/ItemDragonsSword";
import { itemGoldenSword } from "./tier5/ItemGoldenSword";
import { itemLeviathanSword } from "./tier5/ItemLeviathanSword";
import { itemBronzeFuryBroadsword } from "./tier6/ItemBronzeFuryBroadsword";
import { itemOceanSaberSword } from "./tier6/ItemOceanSaberSword";
import { itemPixieCutSword } from "./tier6/ItemPixieCutSword";
import { itemTigerSword } from "./tier6/ItemTigerSword";
import { itemCenturionBroadsword } from "./tier7/ItemCenturionBroadsword";
import { itemJadeBlade } from "./tier7/ItemJadeBlade";
import { itemWindCutterSword } from "./tier7/ItemWindCutterSword";
import { itemIronFistSword } from "./tier8/ItemIronFistSword";
import { itemMoonshadeSword } from "./tier8/ItemMoonshadeSword";
import { itemVenomStrikeSword } from "./tier8/ItemVenomStrikeSword";
import { itemGorgonBlade } from "./tier9/ItemGorgonBlade";
import { itemLightBringerSword } from "./tier9/ItemLightBringerSword";
import { itemStellarBlade } from "./tier9/ItemStellarBlade";
import { itemThunderStrikeSword } from "./tier9/ItemThunderStrikeSword";

export const swordsBlueprintIndex = {
  [SwordsBlueprint.ShortSword]: itemShortSword,
  [SwordsBlueprint.BasiliskSword]: itemBasiliskSword,
  [SwordsBlueprint.DragonsSword]: itemDragonsSword,
  [SwordsBlueprint.DoubleEdgedSword]: itemDoubleEdgedSword,
  [SwordsBlueprint.BroadSword]: itemBroadSword,
  [SwordsBlueprint.ElvenSword]: itemElvenSword,
  [SwordsBlueprint.Katana]: itemKatana,
  [SwordsBlueprint.KnightsSword]: itemKnightsSword,
  [SwordsBlueprint.FireSword]: itemFireSword,
  [SwordsBlueprint.IceSword]: itemIceSword,
  [SwordsBlueprint.CorruptionSword]: itemCorruptionSword,
  [SwordsBlueprint.DamascusSword]: itemDamascusSword,
  [SwordsBlueprint.EldensSword]: itemEldensSword,
  [SwordsBlueprint.EnchantedSword]: itemEnchantedSword,
  [SwordsBlueprint.GoldenSword]: itemGoldenSword,
  [SwordsBlueprint.LeviathanSword]: itemLeviathanSword,
  [SwordsBlueprint.LightingSword]: itemLightingSword,
  [SwordsBlueprint.LongSword]: itemLongSword,
  [SwordsBlueprint.MithrilSword]: itemMithrilSword,
  [SwordsBlueprint.Rapier]: itemRapier,
  [SwordsBlueprint.Saber]: itemSaber,
  [SwordsBlueprint.Sword]: itemSword,
  [SwordsBlueprint.WoodenSword]: itemWoodenSword,
  [SwordsBlueprint.YggdrasilJianSword]: itemYggdrasilJianSword,
  [SwordsBlueprint.YggdrasilTemplarSword]: itemYggdrasilTemplarSword,
  [SwordsBlueprint.YggdrasilGladius]: itemYggdrasilGladius,
  [SwordsBlueprint.JianSword]: itemJianSword,
  [SwordsBlueprint.RoyalSword]: itemRoyalSword,
  [SwordsBlueprint.TemplarSword]: itemTemplarSword,
  [SwordsBlueprint.PoisonSword]: itemPoisonSword,
  [SwordsBlueprint.ShadowSword]: itemShadowSword,
  [SwordsBlueprint.CopperBroadsword]: itemCopperBroadsword,
  [SwordsBlueprint.IceShardLongsword]: itemIceShardLongsword,
  [SwordsBlueprint.FrostguardSword]: itemFrostguardSword,
  [SwordsBlueprint.TungstenSword]: itemTungstenSword,
  [SwordsBlueprint.FrostbiteBlade]: itemFrostbiteBlade,
  [SwordsBlueprint.IronwoodTanto]: itemIronwoodTanto,
  [SwordsBlueprint.FalconsSword]: itemFalconsSword,
  [SwordsBlueprint.GlacialSword]: itemGlacialSword,
  [SwordsBlueprint.AzureMachete]: itemAzureMachete,
  [SwordsBlueprint.AngelicSword]: itemAngelicSword,
  [SwordsBlueprint.DiamondSword]: itemDiamondSword,
  [SwordsBlueprint.ElucidatorSword]: itemElucidatorSword,
  [SwordsBlueprint.RoyalGuardianSword]: itemRoyalGuardianSword,
  [SwordsBlueprint.TigerSword]: itemTigerSword,
  [SwordsBlueprint.LightBringerSword]: itemLightBringerSword,
  [SwordsBlueprint.InfernoEdgeSword]: itemInfernoEdgeSword,
  [SwordsBlueprint.WindCutterSword]: itemWindCutterSword,
  [SwordsBlueprint.ThunderStrikeSword]: itemThunderStrikeSword,
  [SwordsBlueprint.MoonshadeSword]: itemMoonshadeSword,
  [SwordsBlueprint.VenomStrikeSword]: itemVenomStrikeSword,
  [SwordsBlueprint.HellfireEdgeSword]: itemHellfireEdgeSword,
  [SwordsBlueprint.EmeraldBroadsword]: itemEmeraldBroadsword,
  [SwordsBlueprint.JadeBlade]: itemJadeBlade,
  [SwordsBlueprint.BronzeFuryBroadsword]: itemBronzeFuryBroadsword,
  [SwordsBlueprint.GorgonBlade]: itemGorgonBlade,
  [SwordsBlueprint.CenturionBroadsword]: itemCenturionBroadsword,
  [SwordsBlueprint.CopperveinBlade]: itemCopperveinBlade,
  [SwordsBlueprint.MinotaurSword]: itemMinotaurSword,
  [SwordsBlueprint.TitaniumBroadsword]: itemTitaniumBroadsword,
  [SwordsBlueprint.WarlordBroadsword]: itemWarlordBroadsword,
  [SwordsBlueprint.GuardianSword]: itemGuardianSword,
  [SwordsBlueprint.ZenBroadsword]: itemZenBroadsword,
  [SwordsBlueprint.PhoenixSword]: itemPhoenixSword,
  [SwordsBlueprint.StellarBlade]: itemStellarBlade,
  [SwordsBlueprint.OceanSaberSword]: itemOceanSaberSword,
  [SwordsBlueprint.IronFistSword]: itemIronFistSword,
  [SwordsBlueprint.GhostTalonSword]: itemGhostTalonSword,
  [SwordsBlueprint.VioletVenomSword]: itemVioletVenomSword,
  [SwordsBlueprint.NemesisSword]: itemNemesisSword,
  [SwordsBlueprint.PixieCutSword]: itemPixieCutSword,
};
