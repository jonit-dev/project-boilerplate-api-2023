import { BootsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBoots } from "./ItemBoots";
import { itemCopperBoots } from "./ItemCopperBoots";
import { itemGoldenBoots } from "./ItemGoldenBoots";
import { itemIronBoots } from "./ItemIronBoots";
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
};
