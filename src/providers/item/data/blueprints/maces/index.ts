import { MacesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemClub } from "./tier0/ItemClub";
import { itemWoodenMace } from "./tier0/ItemWoodenMace";
import { itemMace } from "./tier1/ItemMace";
import { itemSpikedClub } from "./tier1/ItemSpikedClub";
import { itemSpikedMace } from "./tier2/ItemSpikedMace";
import { itemRusticFlail } from "./tier3/ItemRusticFlail";
import { itemSilverBulbMace } from "./tier3/ItemSilverBulbMace";
import { itemBloodstainedCenser } from "./tier4/ItemBloodstainedCenser";

export const macesBlueprintIndex = {
  [MacesBlueprint.Club]: itemClub,
  [MacesBlueprint.Mace]: itemMace,
  [MacesBlueprint.SpikedClub]: itemSpikedClub,
  [MacesBlueprint.SpikedMace]: itemSpikedMace,
  [MacesBlueprint.WoodenMace]: itemWoodenMace,
  [MacesBlueprint.RusticFlail]: itemRusticFlail,
  [MacesBlueprint.BloodstainedCenser]: itemBloodstainedCenser,
  [MacesBlueprint.SilverBulbMace]: itemSilverBulbMace,
};
