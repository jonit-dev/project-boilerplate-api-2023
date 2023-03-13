import { MacesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBloodstainedCenser } from "./ItemBloodstainedCenser";
import { itemClub } from "./ItemClub";
import { itemMace } from "./ItemMace";
import { itemRusticFlail } from "./ItemRusticFlail";
import { itemSilverBulbMace } from "./ItemSilverBulbMace";
import { itemSpikedClub } from "./ItemSpikedClub";
import { itemSpikedMace } from "./ItemSpikedMace";
import { itemWoodenMace } from "./ItemWoodenMace";

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
