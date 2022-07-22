import { BootsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBoots } from "./ItemBoots";
import { itemCopperBoots } from "./ItemCopperBoots";
import { itemIronBoots } from "./ItemIronBoots";
import { itemReforcedBoots } from "./ItemReforcedBoots";
import { itemSandals } from "./ItemSandals";
import { itemStuddedBoots } from "./ItemStuddedBoots";

export const bootsBlueprintIndex = {
  [BootsBlueprint.Boots]: itemBoots,
  [BootsBlueprint.CopperBoots]: itemCopperBoots,
  [BootsBlueprint.Sandals]: itemSandals,
  [BootsBlueprint.IronBoots]: itemIronBoots,
  [BootsBlueprint.ReforcedBoots]: itemReforcedBoots,
  [BootsBlueprint.StuddedBoots]: itemStuddedBoots,
};
