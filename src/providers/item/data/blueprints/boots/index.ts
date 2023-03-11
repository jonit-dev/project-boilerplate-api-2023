import { BootsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBloodfireBoot } from "./ItemBloodfireBoot";
import { itemBoots } from "./ItemBoots";
import { itemCopperBoots } from "./ItemCopperBoots";
import { itemFarmersBoot } from "./ItemFarmersBoot";
import { itemGoldenBoots } from "./ItemGoldenBoots";
import { itemIronBoots } from "./ItemIronBoots";
import { itemJadeEmperorsBoot } from "./ItemJadeEmperorsBoot";
import { itemPlateBoots } from "./ItemPlateBoots";
import { itemReforcedBoots } from "./ItemReforcedBoots";
import { itemRoyalBoots } from "./ItemRoyalBoots";
import { itemSandals } from "./ItemSandals";
import { itemSilverBoots } from "./ItemSilverBoots";
import { itemStuddedBoots } from "./ItemStuddedBoots";

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
