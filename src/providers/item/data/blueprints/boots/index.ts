import { BootsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBoots } from "./tier0/ItemBoots";
import { itemFarmersBoot } from "./tier0/ItemFarmersBoot";
import { itemSandals } from "./tier0/ItemSandals";
import { itemStuddedBoots } from "./tier0/ItemStuddedBoots";
import { itemCopperBoots } from "./tier1/ItemCopperBoots";
import { itemIronBoots } from "./tier1/ItemIronBoots";
import { itemReforcedBoots } from "./tier1/ItemReforcedBoots";
import { itemVoltstepBoots } from "./tier10/ItemVoltstepBoots";
import { itemSolarflareBoots } from "./tier11/ItemSolarflareBoots";
import { itemGaiasSoleplate } from "./tier12/ItemGaiasSoleplate";
import { itemBloodfireBoot } from "./tier2/ItemBloodfireBoot";
import { itemBronzeBoots } from "./tier2/ItemBronzeBoots";
import { itemJadeEmperorsBoot } from "./tier2/ItemJadeEmperorsBoot";
import { itemPlateBoots } from "./tier2/ItemPlateBoots";
import { itemSilverBoots } from "./tier2/ItemSilverBoots";
import { itemSteelBoots } from "./tier2/ItemSteelBoots";
import { itemGoldenBoots } from "./tier3/ItemGoldenBoots";
import { itemRoyalBoots } from "./tier3/ItemRoyalBoots";
import { itemChainBoots } from "./tier4/ItemChainBoots";
import { itemLeafstepBoots } from "./tier5/ItemLeafstepBoots";
import { itemCavalierBoots } from "./tier6/ItemCavalierBoots";
import { itemKnightBoots } from "./tier7/ItemKnightBoots";
import { itemFalconBoots } from "./tier8/ItemFalconBoots";
import { itemWindstriderBoots } from "./tier9/ItemWindstriderBoots";

export const bootsBlueprintIndex = {
  [BootsBlueprint.Boots]: itemBoots,
  [BootsBlueprint.CopperBoots]: itemCopperBoots,
  [BootsBlueprint.GoldenBoots]: itemGoldenBoots,
  [BootsBlueprint.IronBoots]: itemIronBoots,
  [BootsBlueprint.PlateBoots]: itemPlateBoots,
  [BootsBlueprint.ReforcedBoots]: itemReforcedBoots,
  [BootsBlueprint.RoyalBoots]: itemRoyalBoots,
  [BootsBlueprint.Sandals]: itemSandals,
  [BootsBlueprint.SilverBoots]: itemSilverBoots,
  [BootsBlueprint.StuddedBoots]: itemStuddedBoots,
  [BootsBlueprint.BloodfireBoot]: itemBloodfireBoot,
  [BootsBlueprint.FarmersBoot]: itemFarmersBoot,
  [BootsBlueprint.JadeEmperorsBoot]: itemJadeEmperorsBoot,
  [BootsBlueprint.BronzeBoots]: itemBronzeBoots,
  [BootsBlueprint.CavalierBoots]: itemCavalierBoots,
  [BootsBlueprint.ChainBoots]: itemChainBoots,
  [BootsBlueprint.FalconBoots]: itemFalconBoots,
  [BootsBlueprint.GaiasSoleplate]: itemGaiasSoleplate,
  [BootsBlueprint.KnightBoots]: itemKnightBoots,
  [BootsBlueprint.LeafstepBoots]: itemLeafstepBoots,
  [BootsBlueprint.SolarflareBoots]: itemSolarflareBoots,
  [BootsBlueprint.SteelBoots]: itemSteelBoots,
  [BootsBlueprint.VoltstepBoots]: itemVoltstepBoots,
  [BootsBlueprint.WindstriderBoots]: itemWindstriderBoots,
};
