import { LegsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemLeatherLegs } from "./tier0/ItemLeatherLegs";
import { itemStuddedLegs } from "./tier1/ItemStuddedLegs";
import { itemAzureFrostLegs } from "./tier10/ItemAzureFrostLegs";
import { itemTempestLegs } from "./tier10/ItemTempestLegs";
import { itemDwarvenLegs } from "./tier11/ItemDwarvenLegs";
import { itemIvoryMoonLegs } from "./tier11/ItemIvoryMoonLegs";
import { itemKingsGuardLegs } from "./tier12/ItemKingsGuardLegs";
import { itemSolarflareLegs } from "./tier12/ItemSolarflareLegs";
import { itemDragonScaleLegs } from "./tier13/ItemDragonScaleLegs";
import { itemBronzeLegs } from "./tier2/ItemBronzeLegs";
import { itemFalconsLegs } from "./tier3/ItemFalconsLegs";
import { itemGlacialLegs } from "./tier3/ItemGlacialLegs";
import { itemBloodfireLegs } from "./tier4/ItemBloodfireLegs";
import { itemGoldenLegs } from "./tier4/ItemGoldenLegs";
import { itemMithrilLegs } from "./tier4/ItemMithrilLegs";
import { itemRustedIronLegs } from "./tier6/ItemRustedIronLegs";
import { itemPlatinumTintLegs } from "./tier6/itemPlatinumTintLegs";
import { itemBlueLegs } from "./tier7/ItemBlueLegs";
import { itemPridelandsLegs } from "./tier7/ItemPridelandsLegs";
import { itemSilvershadeLegs } from "./tier8/ItemSilvershadeLegs";
import { itemHoneyGlowLegs } from "./tier9/ItemHoneyGlowLegs";
import { itemTerraformLegs } from "./tier9/ItemTerraformLegs";

export const legsBlueprintIndex = {
  [LegsBlueprint.LeatherLegs]: itemLeatherLegs,
  [LegsBlueprint.StuddedLegs]: itemStuddedLegs,
  [LegsBlueprint.BronzeLegs]: itemBronzeLegs,
  [LegsBlueprint.GoldenLegs]: itemGoldenLegs,
  [LegsBlueprint.MithrilLegs]: itemMithrilLegs,
  [LegsBlueprint.BloodfireLegs]: itemBloodfireLegs,
  [LegsBlueprint.FalconsLegs]: itemFalconsLegs,
  [LegsBlueprint.GlacialLegs]: itemGlacialLegs,
  [LegsBlueprint.BlueLegs]: itemBlueLegs,
  [LegsBlueprint.DragonScaleLegs]: itemDragonScaleLegs,
  [LegsBlueprint.DwarvenLegs]: itemDwarvenLegs,
  [LegsBlueprint.SilvershadeLegs]: itemSilvershadeLegs,
  [LegsBlueprint.TerraformLegs]: itemTerraformLegs,
  [LegsBlueprint.TempestLegs]: itemTempestLegs,
  [LegsBlueprint.SolarflareLegs]: itemSolarflareLegs,
  [LegsBlueprint.IvoryMoonLegs]: itemIvoryMoonLegs,
  [LegsBlueprint.KingsGuardLegs]: itemKingsGuardLegs,
  [LegsBlueprint.AzureFrostLegs]: itemAzureFrostLegs,
  [LegsBlueprint.HoneyGlowLegs]: itemHoneyGlowLegs,
  [LegsBlueprint.RustedIronLegs]: itemRustedIronLegs,
  [LegsBlueprint.PlatinumTintLegs]: itemPlatinumTintLegs,
  [LegsBlueprint.PridelandsLegs]: itemPridelandsLegs,
};
