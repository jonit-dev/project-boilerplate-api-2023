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
import { itemWitchBaneMace } from "./tier4/ItemWitchBaneMace";
import { itemHellishKingMace } from "./tier5/ItemHellishKingMace";
import { itemSpectralMace } from "./tier5/ItemSpectralMace";
import { itemYggdrasilKingMace } from "./tier5/ItemYggdrasilKingMace";
import { itemBronzeFistMace } from "./tier6/ItemBronzeFistMace";
import { itemSkullCrusherMace } from "./tier6/ItemSkullCrusherMace";
import { itemSilverFistMace } from "./tier7/ItemSilverFistMace";

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
  [MacesBlueprint.WitchBaneMace]: itemWitchBaneMace,
  [MacesBlueprint.SpectralMace]: itemSpectralMace,
  [MacesBlueprint.SkullCrusherMace]: itemSkullCrusherMace,
  [MacesBlueprint.BronzeFistMace]: itemBronzeFistMace,
  [MacesBlueprint.SilverFistMace]: itemSilverFistMace,
};
