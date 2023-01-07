import { AxesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAxe } from "./ItemAxe";
import { itemBardiche } from "./itemBardiche";
import { itemCorruptionAxe } from "./ItemCorruptionAxe";
import { itemDoubleAxe } from "./itemDoubleAxe";
import { itemDwarvenWaraxe } from "./ItemDwarvenWaraxe";
import { itemFrostDoubleAxe } from "./ItemFrostDoubleAxe";
import { itemGoldenAxe } from "./ItemGoldenAxe";
import { itemGreataxe } from "./ItemGreataxe";
import { itemHalberd } from "./ItemHalberd";
import { itemHatchet } from "./ItemHatchet";
import { itemHellishAxe } from "./ItemHellishAxe";
import { itemRoyalDoubleAxe } from "./ItemRoyalDoubleAxe";
import { itemVikingAxe } from "./ItemVikingAxe";
import { itemYetiHalberd } from "./ItemYetiHalberd";

export const axesBlueprintIndex = {
  [AxesBlueprint.Axe]: itemAxe,
  [AxesBlueprint.Bardiche]: itemBardiche,
  [AxesBlueprint.DoubleAxe]: itemDoubleAxe,
  [AxesBlueprint.FrostDoubleAxe]: itemFrostDoubleAxe,
  [AxesBlueprint.YetiHalberd]: itemYetiHalberd,
  [AxesBlueprint.CorruptionAxe]: itemCorruptionAxe,
  [AxesBlueprint.DwarvenWaraxe]: itemDwarvenWaraxe,
  [AxesBlueprint.GoldenAxe]: itemGoldenAxe,
  [AxesBlueprint.Greataxe]: itemGreataxe,
  [AxesBlueprint.Halberd]: itemHalberd,
  [AxesBlueprint.Hatchet]: itemHatchet,
  [AxesBlueprint.HellishAxe]: itemHellishAxe,
  [AxesBlueprint.RoyalDoubleAxe]: itemRoyalDoubleAxe,
  [AxesBlueprint.VikingAxe]: itemVikingAxe,
};
