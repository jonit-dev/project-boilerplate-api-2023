import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemArrow } from "./ammo/ItemArrow";
import { itemBolt } from "./ammo/ItemBolt";
import { itemCorruptionBolt } from "./ammo/ItemCorruptionBolt";
import { itemCrimsonArrow } from "./ammo/ItemCrimsonArrow";
import { itemCrystallineArrow } from "./ammo/ItemCrystallineArrow";
import { itemCursedBolt } from "./ammo/ItemCursedBolt";
import { itemEarthArrow } from "./ammo/ItemEarthArrow";
import { itemElvenBolt } from "./ammo/ItemElvenBolt";
import { itemEmeraldArrow } from "./ammo/ItemEmeraldArrow";
import { itemFireBolt } from "./ammo/ItemFireBolt";
import { itemFrostArrow } from "./ammo/ItemFrostArrow";
import { itemGoldenArrow } from "./ammo/ItemGoldenArrow";
import { itemGossamerBolt } from "./ammo/ItemGossamerBolt";
import { itemHeartseekerArrow } from "./ammo/ItemHeartseekerArrow";
import { itemIronArrow } from "./ammo/ItemIronArrow";
import { itemPoisonArrow } from "./ammo/ItemPoisonArrow";
import { itemSeekerArrow } from "./ammo/ItemSeekerArrow";
import { itemShockArrow } from "./ammo/ItemShockArrow";
import { itemSilvermoonArrow } from "./ammo/ItemSilvermoonArrow";
import { itemStone } from "./ammo/ItemStone";
import { itemSunflareArrow } from "./ammo/ItemSunflareArrow";
import { itemWardenArrow } from "./ammo/ItemWardenArrow";
import { itemWoodenArrow } from "./ammo/ItemWoodenArrow";
import { itemBow } from "./tier0/ItemBow";
import { itemSlingshot } from "./tier0/ItemSlingshot";
import { itemWoodenBow } from "./tier0/ItemWoodenBow";
import { itemCompoundBow } from "./tier1/ItemCompoundBow";
import { itemCrossbow } from "./tier1/ItemCrossbow";
import { itemElvenBow } from "./tier1/ItemElvenBow";
import { itemHorseBow } from "./tier1/ItemHorseBow";
import { itemShortBow } from "./tier1/ItemShortBow";
import { itemShuriken } from "./tier1/ItemShuriken";
import { itemDragonWingBow } from "./tier10/ItemDragonWingBow";
import { itemStarsHooterBow } from "./tier11/ItemStarsHooterBow";
import { itemUmbralBow } from "./tier12/ItemUmbralBow";
import { itemCorruptionBow } from "./tier2/ItemCorruptionBow";
import { itemEbonyLongbow } from "./tier2/ItemEbonyLongbow";
import { itemFrostBow } from "./tier2/ItemFrostBow";
import { itemFrostCrossbow } from "./tier2/ItemFrostCrossbow";
import { itemHuntersBow } from "./tier2/ItemHuntersBow";
import { itemLongBow } from "./tier2/ItemLongBow";
import { itemOrcishBow } from "./tier2/ItemOrcishBow";
import { itemAsterionsBow } from "./tier3/ItemAsterionsBow";
import { itemEldensBow } from "./tier3/ItemEldensBow";
import { itemElmReflexBow } from "./tier3/ItemElmReflexBow";
import { itemLightningCrossbow } from "./tier3/ItemLightningCrossbow";
import { itemRedwoodLongbow } from "./tier3/ItemRedwoodLongbow";
import { itemRuneBow } from "./tier3/ItemRuneBow";
import { itemRuneCrossbow } from "./tier3/ItemRuneCrossbow";
import { itemHadesBow } from "./tier4/ItemHadesBow";
import { itemHellishBow } from "./tier4/ItemHellishBow";
import { itemPhoenixBow } from "./tier4/ItemPhoenixBow";
import { itemRoyalBow } from "./tier4/ItemRoyalBow";
import { itemRoyalCrossbow } from "./tier4/ItemRoyalCrossbow";
import { itemScythianGoldenBow } from "./tier4/ItemScythianGoldenBow";
import { itemTurkishGoldenBow } from "./tier4/ItemTurkishGoldenBow";
import { itemDragonBow } from "./tier5/ItemDragonBow";
import { itemStormBow } from "./tier5/ItemStormBow";
import { itemSunstoneBow } from "./tier5/ItemSunstoneBow";
import { itemValkyriesBow } from "./tier5/ItemValkyriesBow";
import { itemYggdrasilBow } from "./tier5/ItemYggdrasilBow";
import { itemZephyrusBow } from "./tier5/ItemZephyrusBow";
import { itemIronBarkBow } from "./tier6/ItemIronBarkBow";
import { itemParallelPrecisionBow } from "./tier6/ItemParallelPrecisionBow";
import { itemWhisperWindBow } from "./tier6/ItemWhisperWindBow";
import { itemEaglesEyeBow } from "./tier7/ItemEaglesEyeBow";
import { itemGaleGuardianGripCrossbow } from "./tier7/ItemGaleGuardianGripCrossbow";
import { itemStoneBreakerBow } from "./tier8/ItemStoneBreakerBow";
import { itemTempestTalonTautBow } from "./tier8/ItemTempestTalonTautBow";
import { itemBloodseekerBow } from "./tier9/ItemBloodseekerBow";
import { itemChordedCataclysmBow } from "./tier9/ItemChordedCataclysmBow";
import { itemGorgonGazeGuardianBow } from "./tier9/ItemGorgonGazeGuardianBow";

export const rangedWeaponsBlueprintIndex = {
  [RangedWeaponsBlueprint.Slingshot]: itemSlingshot,
  [RangedWeaponsBlueprint.Stone]: itemStone,
  [RangedWeaponsBlueprint.Shuriken]: itemShuriken,
  [RangedWeaponsBlueprint.Arrow]: itemArrow,
  [RangedWeaponsBlueprint.Crossbow]: itemCrossbow,
  [RangedWeaponsBlueprint.Bolt]: itemBolt,
  [RangedWeaponsBlueprint.Bow]: itemBow,
  [RangedWeaponsBlueprint.OrcishBow]: itemOrcishBow,
  [RangedWeaponsBlueprint.FrostBow]: itemFrostBow,
  [RangedWeaponsBlueprint.FrostCrossbow]: itemFrostCrossbow,
  [RangedWeaponsBlueprint.EmeraldArrow]: itemEmeraldArrow,
  [RangedWeaponsBlueprint.FrostArrow]: itemFrostArrow,
  [RangedWeaponsBlueprint.IronArrow]: itemIronArrow,
  [RangedWeaponsBlueprint.CrimsonArrow]: itemCrimsonArrow,
  [RangedWeaponsBlueprint.AsterionsBow]: itemAsterionsBow,
  [RangedWeaponsBlueprint.CompoundBow]: itemCompoundBow,
  [RangedWeaponsBlueprint.CorruptionBolt]: itemCorruptionBolt,
  [RangedWeaponsBlueprint.CorruptionBow]: itemCorruptionBow,
  [RangedWeaponsBlueprint.EldensBow]: itemEldensBow,
  [RangedWeaponsBlueprint.ElvenBolt]: itemElvenBolt,
  [RangedWeaponsBlueprint.ElvenBow]: itemElvenBow,
  [RangedWeaponsBlueprint.FireBolt]: itemFireBolt,
  [RangedWeaponsBlueprint.HellishBow]: itemHellishBow,
  [RangedWeaponsBlueprint.HorseBow]: itemHorseBow,
  [RangedWeaponsBlueprint.HuntersBow]: itemHuntersBow,
  [RangedWeaponsBlueprint.LongBow]: itemLongBow,
  [RangedWeaponsBlueprint.RoyalBow]: itemRoyalBow,
  [RangedWeaponsBlueprint.RoyalCrossbow]: itemRoyalCrossbow,
  [RangedWeaponsBlueprint.ShortBow]: itemShortBow,
  [RangedWeaponsBlueprint.ScythianGoldenBow]: itemScythianGoldenBow,
  [RangedWeaponsBlueprint.TurkishGoldenBow]: itemTurkishGoldenBow,
  [RangedWeaponsBlueprint.YggdrasilBow]: itemYggdrasilBow,
  [RangedWeaponsBlueprint.PoisonArrow]: itemPoisonArrow,
  [RangedWeaponsBlueprint.GoldenArrow]: itemGoldenArrow,
  [RangedWeaponsBlueprint.ShockArrow]: itemShockArrow,
  [RangedWeaponsBlueprint.RuneCrossbow]: itemRuneCrossbow,
  [RangedWeaponsBlueprint.LightningCrossbow]: itemLightningCrossbow,
  [RangedWeaponsBlueprint.ZephyrusBow]: itemZephyrusBow,
  [RangedWeaponsBlueprint.ValkyriesBow]: itemValkyriesBow,
  [RangedWeaponsBlueprint.StormBow]: itemStormBow,
  [RangedWeaponsBlueprint.RuneBow]: itemRuneBow,
  [RangedWeaponsBlueprint.PhoenixBow]: itemPhoenixBow,
  [RangedWeaponsBlueprint.DragonBow]: itemDragonBow,
  [RangedWeaponsBlueprint.SunstoneBow]: itemSunstoneBow,
  [RangedWeaponsBlueprint.HadesBow]: itemHadesBow,
  [RangedWeaponsBlueprint.WoodenArrow]: itemWoodenArrow,
  [RangedWeaponsBlueprint.WoodenBow]: itemWoodenBow,
  [RangedWeaponsBlueprint.RedwoodLongbow]: itemRedwoodLongbow,
  [RangedWeaponsBlueprint.ElmReflexBow]: itemElmReflexBow,
  [RangedWeaponsBlueprint.EbonyLongbow]: itemEbonyLongbow,
  [RangedWeaponsBlueprint.EaglesEyeBow]: itemEaglesEyeBow,
  [RangedWeaponsBlueprint.StarsHooterBow]: itemStarsHooterBow,
  [RangedWeaponsBlueprint.BloodseekerBow]: itemBloodseekerBow,
  [RangedWeaponsBlueprint.StoneBreakerBow]: itemStoneBreakerBow,
  [RangedWeaponsBlueprint.DragonWingBow]: itemDragonWingBow,
  [RangedWeaponsBlueprint.WhisperWindBow]: itemWhisperWindBow,
  [RangedWeaponsBlueprint.IronBarkBow]: itemIronBarkBow,
  [RangedWeaponsBlueprint.UmbralBow]: itemUmbralBow,
  [RangedWeaponsBlueprint.HeartseekerArrow]: itemHeartseekerArrow,
  [RangedWeaponsBlueprint.CrystallineArrow]: itemCrystallineArrow,
  [RangedWeaponsBlueprint.SilvermoonArrow]: itemSilvermoonArrow,
  [RangedWeaponsBlueprint.SeekerArrow]: itemSeekerArrow,
  [RangedWeaponsBlueprint.EarthArrow]: itemEarthArrow,
  [RangedWeaponsBlueprint.CursedBolt]: itemCursedBolt,
  [RangedWeaponsBlueprint.GossamerBolt]: itemGossamerBolt,
  [RangedWeaponsBlueprint.SunflareArrow]: itemSunflareArrow,
  [RangedWeaponsBlueprint.WardenArrow]: itemWardenArrow,
  [RangedWeaponsBlueprint.TempestTalonTautBow]: itemTempestTalonTautBow,
  [RangedWeaponsBlueprint.ChordedCataclysmBow]: itemChordedCataclysmBow,
  [RangedWeaponsBlueprint.ParallelPrecisionBow]: itemParallelPrecisionBow,
  [RangedWeaponsBlueprint.GorgonGazeGuardianBow]: itemGorgonGazeGuardianBow,
  [RangedWeaponsBlueprint.GaleGuardianGripCrossbow]: itemGaleGuardianGripCrossbow,
};
