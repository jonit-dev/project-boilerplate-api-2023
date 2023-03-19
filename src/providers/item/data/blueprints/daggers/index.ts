import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAzureDagger } from "./ItemAzureDagger";
import { itemCopperJitte } from "./ItemCopperJitte";
import { itemCorruptionDagger } from "./ItemCorruptionDagger";
import { itemDagger } from "./ItemDagger";
import { itemDamascusJitte } from "./ItemDamascusJitte";
import { itemFrostDagger } from "./ItemFrostDagger";
import { itemGoldenDagger } from "./ItemGoldenDagger";
import { itemHellishDagger } from "./ItemHellishDagger";
import { itemIronDagger } from "./ItemIronDagger";
import { itemIronJitte } from "./ItemIronJitte";
import { itemKunai } from "./ItemKunai";
import { itemNinjaKunai } from "./ItemNinjaKunai";
import { itemPhoenixDagger } from "./ItemPhoenixDagger";
import { itemPhoenixJitte } from "./ItemPhoenixJitte";
import { itemRustedDagger } from "./ItemRustedDagger";
import { itemRustedJitte } from "./ItemRustedJitte";
import { itemSaiDagger } from "./ItemSaiDagger";
import { itemSapphireDagger } from "./ItemSapphireDagger";
import { itemSapphireJitte } from "./ItemSapphireJitte";
import { itemVerdantDagger } from "./ItemVerdantDagger";
import { itemVerdantJitte } from "./ItemVerdantJitte";
import { itemWoodenDagger } from "./ItemWoodenDagger";

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
