import { AxesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAxe } from "./tier0/ItemAxe";
import { itemWoodenAxe } from "./tier0/ItemWoodenAxe";
import { itemCopperAxe } from "./tier1/ItemCopperAxe";
import { itemHatchet } from "./tier1/ItemHatchet";
import { itemBardiche } from "./tier1/itemBardiche";
import { itemCorruptionAxe } from "./tier2/ItemCorruptionAxe";
import { itemRuneAxe } from "./tier2/ItemRuneAxe";
import { itemSilverAxe } from "./tier2/ItemSilverAxe";
import { itemVikingAxe } from "./tier2/ItemVikingAxe";
import { itemDwarvenWaraxe } from "./tier3/ItemDwarvenWaraxe";
import { itemFrostDoubleAxe } from "./tier3/ItemFrostDoubleAxe";
import { itemGlacialHatchet } from "./tier3/ItemGlacialHatchet";
import { itemHellishVikingAxe } from "./tier3/ItemHellishVikingAxe";
import { itemHellishWarAxe } from "./tier3/ItemHellishWarAxe";
import { itemNordicAxe } from "./tier3/ItemNordicAxe";
import { itemShadowAxe } from "./tier3/ItemShadowAxe";
import { itemVikingBattleAxe } from "./tier3/ItemVikingBattleAxe";
import { itemDoubleAxe } from "./tier3/itemDoubleAxe";
import { itemGlacialAxe } from "./tier4/ItemGlacialAxe";
import { itemGreataxe } from "./tier4/ItemGreataxe";
import { itemHalberd } from "./tier4/ItemHalberd";
import { itemHellishAxe } from "./tier4/ItemHellishAxe";
import { itemWhiteRavenAxe } from "./tier4/ItemWhiteRavenAxe";
import { itemYetiHalberd } from "./tier4/ItemYetiHalberd";
import { itemYggdrasilVikingAxe } from "./tier4/ItemYggdrasilVikingAxe";
import { itemGoldenAxe } from "./tier5/ItemGoldenAxe";
import { itemRoyalDoubleAxe } from "./tier5/ItemRoyalDoubleAxe";
import { itemYggdrasilWarAxe } from "./tier5/ItemYggdrasilWarAxe";

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
  [AxesBlueprint.WoodenAxe]: itemWoodenAxe,
  [AxesBlueprint.HellishVikingAxe]: itemHellishVikingAxe,
  [AxesBlueprint.HellishWarAxe]: itemHellishWarAxe,
  [AxesBlueprint.YggdrasilWarAxe]: itemYggdrasilWarAxe,
  [AxesBlueprint.YggdrasilVikingAxe]: itemYggdrasilVikingAxe,
  [AxesBlueprint.NordicAxe]: itemNordicAxe,
  [AxesBlueprint.RuneAxe]: itemRuneAxe,
  [AxesBlueprint.ShadowAxe]: itemShadowAxe,
  [AxesBlueprint.VikingBattleAxe]: itemVikingBattleAxe,
  [AxesBlueprint.CopperAxe]: itemCopperAxe,
  [AxesBlueprint.SilverAxe]: itemSilverAxe,
  [AxesBlueprint.WhiteRavenAxe]: itemWhiteRavenAxe,
  [AxesBlueprint.GlacialAxe]: itemGlacialAxe,
  [AxesBlueprint.GlacialHatchet]: itemGlacialHatchet,
};
