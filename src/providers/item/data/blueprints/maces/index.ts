import { MacesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemClub } from "./tier0/ItemClub";
import { itemWoodenMace } from "./tier0/ItemWoodenMace";
import { itemMace } from "./tier1/ItemMace";
import { itemSpikedClub } from "./tier1/ItemSpikedClub";
import { itemSpikedMace } from "./tier2/ItemSpikedMace";
import { itemRusticFlail } from "./tier3/ItemRusticFlail";
import { itemSilverBulbMace } from "./tier3/ItemSilverBulbMace";
import { itemBloodstainedCenser } from "./tier4/ItemBloodstainedCenser";
import { itemHellishMace } from "./tier4/ItemHellishMace";
import { itemHellishKingMace } from "./tier5/ItemHellishKingMace";
import { itemYggdrasilKingMace } from "./tier5/ItemYggdrasilKingMace";

export const macesBlueprintIndex = {
  [MacesBlueprint.Club]: itemClub,
  [MacesBlueprint.Mace]: itemMace,
  [MacesBlueprint.SpikedClub]: itemSpikedClub,
  [MacesBlueprint.SpikedMace]: itemSpikedMace,
  [MacesBlueprint.WoodenMace]: itemWoodenMace,
  [MacesBlueprint.HellishKingMace]: itemHellishKingMace,
  [MacesBlueprint.HellishMace]: itemHellishMace,
  [MacesBlueprint.YggdrasilKingMace]: itemYggdrasilKingMace,
  [MacesBlueprint.RusticFlail]: itemRusticFlail,
  [MacesBlueprint.BloodstainedCenser]: itemBloodstainedCenser,
  [MacesBlueprint.SilverBulbMace]: itemSilverBulbMace,
};
