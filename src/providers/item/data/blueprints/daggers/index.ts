import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCorruptionDagger } from "./ItemCorruptionDagger";
import { itemDagger } from "./ItemDagger";
import { itemFrostDagger } from "./ItemFrostDagger";

export const daggersBlueprintIndex = {
  [DaggersBlueprint.Dagger]: itemDagger,
  [DaggersBlueprint.FrostDagger]: itemFrostDagger,
  [DaggersBlueprint.CorruptionDagger]: itemCorruptionDagger,
};
