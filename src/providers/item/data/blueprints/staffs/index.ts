import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAirWand } from "./item0/ItemAirWand";
import { itemWand } from "./item0/ItemWand";
import { itemWoodenStaff } from "./item0/ItemWoodenStaff";
import { itemAppendicesStaff } from "./item1/ItemAppendicesStaff";
import { itemFireWand } from "./item1/ItemFireWand";
import { itemPoisonWand } from "./item1/ItemPoisonWand";
import { itemAquaStaff } from "./item2/ItemAquaStaff";
import { itemCorruptionStaff } from "./item2/ItemCorruptionStaff";
import { itemSoulStaff } from "./item2/ItemSoulStaff";
import { itemEmberward } from "./item3/ItemEmberward";
import { itemFireStaff } from "./item3/ItemFireStaff";
import { itemPoisonStaff } from "./item3/ItemPoisonStaff";
import { itemEnchantedStaff } from "./item4/ItemEnchantedStaff";
import { itemMoonsStaff } from "./item4/ItemMoonsStaff";
import { itemRubyStaff } from "./item4/ItemRubyStaff";
import { itemSkyBlueStaff } from "./item4/ItemSkyBlueStaff";
import { itemRoyalStaff } from "./item5/ItemRoyalStaff";
import { itemSangriaStaff } from "./item5/ItemSangriaStaff";
import { itemTartarusStaff } from "./item5/ItemTartarusStaff";

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
  [StaffsBlueprint.WoodenStaff]: itemWoodenStaff,
  [StaffsBlueprint.SangriaStaff]: itemSangriaStaff,
  [StaffsBlueprint.TartarusStaff]: itemTartarusStaff,
  [StaffsBlueprint.AquaStaff]: itemAquaStaff,
  [StaffsBlueprint.SkyBlueStaff]: itemSkyBlueStaff,
  [StaffsBlueprint.Emberward]: itemEmberward,
};
