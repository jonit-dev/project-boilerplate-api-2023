import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAirWand } from "./ItemAirWand";
import { itemAppendicesStaff } from "./ItemAppendicesStaff";
import { itemCorruptionStaff } from "./ItemCorruptionStaff";
import { itemEnchantedStaff } from "./ItemEnchantedStaff";
import { itemFireStaff } from "./ItemFireStaff";
import { itemFireWand } from "./ItemFireWand";
import { itemMoonsStaff } from "./ItemMoonsStaff";
import { itemPoisonStaff } from "./ItemPoisonStaff";
import { itemPoisonWand } from "./ItemPoisonWand";
import { itemRoyalStaff } from "./ItemRoyalStaff";
import { itemRubyStaff } from "./ItemRubyStaff";
import { itemSoulStaff } from "./ItemSoulStaff";
import { itemWand } from "./ItemWand";

export const staffsBlueprintIndex = {
  [StaffsBlueprint.AppendicesStaff]: itemAppendicesStaff,
  [StaffsBlueprint.CorruptionStaff]: itemCorruptionStaff,
  [StaffsBlueprint.FireStaff]: itemFireStaff,
  [StaffsBlueprint.AirWand]: itemAirWand,
  [StaffsBlueprint.EnchantedStaff]: itemEnchantedStaff,
  [StaffsBlueprint.FireWand]: itemFireWand,
  [StaffsBlueprint.MoonsStaff]: itemMoonsStaff,
  [StaffsBlueprint.PoisonStaff]: itemPoisonStaff,
  [StaffsBlueprint.PoisonWand]: itemPoisonWand,
  [StaffsBlueprint.RoyalStaff]: itemRoyalStaff,
  [StaffsBlueprint.RubyStaff]: itemRubyStaff,
  [StaffsBlueprint.SoulStaff]: itemSoulStaff,
  [StaffsBlueprint.Wand]: itemWand,
};
