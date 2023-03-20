import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemDagger } from "./tier0/ItemDagger";
import { itemWoodenDagger } from "./tier0/ItemWoodenDagger";
import { itemCopperJitte } from "./tier1/ItemCopperJitte";
import { itemIronDagger } from "./tier1/ItemIronDagger";
import { itemIronJitte } from "./tier1/ItemIronJitte";
import { itemRustedDagger } from "./tier1/ItemRustedDagger";
import { itemRustedJitte } from "./tier1/ItemRustedJitte";
import { itemDamascusJitte } from "./tier2/ItemDamascusJitte";
import { itemFrostDagger } from "./tier2/ItemFrostDagger";
import { itemSaiDagger } from "./tier2/ItemSaiDagger";
import { itemCorruptionDagger } from "./tier3/ItemCorruptionDagger";
import { itemKunai } from "./tier3/ItemKunai";
import { itemNinjaKunai } from "./tier3/ItemNinjaKunai";
import { itemSapphireDagger } from "./tier3/ItemSapphireDagger";
import { itemSapphireJitte } from "./tier3/ItemSapphireJitte";
import { itemAzureDagger } from "./tier4/ItemAzureDagger";
import { itemHellishDagger } from "./tier4/ItemHellishDagger";
import { itemPhoenixDagger } from "./tier4/ItemPhoenixDagger";
import { itemPhoenixJitte } from "./tier4/ItemPhoenixJitte";
import { itemVerdantDagger } from "./tier4/ItemVerdantDagger";
import { itemVerdantJitte } from "./tier4/ItemVerdantJitte";
import { itemGoldenDagger } from "./tier5/ItemGoldenDagger";

export const daggersBlueprintIndex = {
  [DaggersBlueprint.Dagger]: itemDagger,
  [DaggersBlueprint.FrostDagger]: itemFrostDagger,
  [DaggersBlueprint.CorruptionDagger]: itemCorruptionDagger,
  [DaggersBlueprint.GoldenDagger]: itemGoldenDagger,
  [DaggersBlueprint.HellishDagger]: itemHellishDagger,
  [DaggersBlueprint.Kunai]: itemKunai,
  [DaggersBlueprint.SaiDagger]: itemSaiDagger,
  [DaggersBlueprint.WoodenDagger]: itemWoodenDagger,
  [DaggersBlueprint.NinjaKunai]: itemNinjaKunai,
  [DaggersBlueprint.CopperJitte]: itemCopperJitte,
  [DaggersBlueprint.RustedDagger]: itemRustedDagger,
  [DaggersBlueprint.IronDagger]: itemIronDagger,
  [DaggersBlueprint.SapphireDagger]: itemSapphireDagger,
  [DaggersBlueprint.SapphireJitte]: itemSapphireJitte,
  [DaggersBlueprint.RustedJitte]: itemRustedJitte,
  [DaggersBlueprint.IronJitte]: itemIronJitte,
  [DaggersBlueprint.VerdantDagger]: itemVerdantDagger,
  [DaggersBlueprint.VerdantJitte]: itemVerdantJitte,
  [DaggersBlueprint.AzureDagger]: itemAzureDagger,
  [DaggersBlueprint.DamascusJitte]: itemDamascusJitte,
  [DaggersBlueprint.PhoenixDagger]: itemPhoenixDagger,
  [DaggersBlueprint.PhoenixJitte]: itemPhoenixJitte,
};
