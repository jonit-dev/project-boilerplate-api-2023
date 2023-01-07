import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCorruptionDagger } from "./ItemCorruptionDagger";
import { itemDagger } from "./ItemDagger";
import { itemFrostDagger } from "./ItemFrostDagger";
import { itemGoldenDagger } from "./ItemGoldenDagger";
import { itemHellishDagger } from "./ItemHellishDagger";
import { itemKunai } from "./ItemKunai";
import { itemSaiDagger } from "./ItemSaiDagger";

export const daggersBlueprintIndex = {
  [DaggersBlueprint.Dagger]: itemDagger,
  [DaggersBlueprint.FrostDagger]: itemFrostDagger,
  [DaggersBlueprint.CorruptionDagger]: itemCorruptionDagger,
  [DaggersBlueprint.GoldenDagger]: itemGoldenDagger,
  [DaggersBlueprint.HellishDagger]: itemHellishDagger,
  [DaggersBlueprint.Kunai]: itemKunai,
  [DaggersBlueprint.SaiDagger]: itemSaiDagger,
};
