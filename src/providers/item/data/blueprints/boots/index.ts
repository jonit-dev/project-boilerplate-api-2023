import { BootsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBoots } from "./tier0/ItemBoots";
import { itemFarmersBoot } from "./tier0/ItemFarmersBoot";
import { itemSandals } from "./tier0/ItemSandals";
import { itemStuddedBoots } from "./tier0/ItemStuddedBoots";
import { itemCopperBoots } from "./tier1/ItemCopperBoots";
import { itemIronBoots } from "./tier1/ItemIronBoots";
import { itemReforcedBoots } from "./tier1/ItemReforcedBoots";
import { itemBloodfireBoot } from "./tier2/ItemBloodfireBoot";
import { itemJadeEmperorsBoot } from "./tier2/ItemJadeEmperorsBoot";
import { itemPlateBoots } from "./tier2/ItemPlateBoots";
import { itemSilverBoots } from "./tier2/ItemSilverBoots";
import { itemGoldenBoots } from "./tier3/ItemGoldenBoots";
import { itemRoyalBoots } from "./tier3/ItemRoyalBoots";

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
};
