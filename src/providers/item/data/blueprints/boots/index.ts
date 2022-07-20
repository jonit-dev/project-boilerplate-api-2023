import { BootsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBoots } from "./ItemBoots";
import { itemCopperBoots } from "./ItemCopperBoots";
import { itemSandals } from "./ItemSandals";

export const bootsBlueprintIndex = {
  [BootsBlueprint.Boots]: itemBoots,
  [BootsBlueprint.CopperBoots]: itemCopperBoots,
  [BootsBlueprint.Sandals]: itemSandals,
};
