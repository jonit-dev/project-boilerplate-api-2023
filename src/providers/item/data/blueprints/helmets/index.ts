import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCap } from "./tier0/ItemCap";
import { itemFarmersHelmet } from "./tier0/ItemFarmersHelmet";
import { itemHuntersCap } from "./tier0/ItemHuntersCap";
import { itemLeatherHelmet } from "./tier0/ItemLeatherHelmet";
import { itemRedHoodie } from "./tier0/ItemRedHoodie";
import { itemTurban } from "./tier0/ItemTurban";
import { itemWizardHat } from "./tier0/ItemWizardHat";
import { itemArabicHelmet } from "./tier1/ItemArabicHelmet";
import { itemBrassHelmet } from "./tier1/ItemBrassHelmet";
import { itemInfantryHelmet } from "./tier1/ItemInfantryHelmet";
import { itemIronHelmet } from "./tier1/ItemIronHelmet";
import { itemSoldiersHelmet } from "./tier1/ItemSoldiersHelmet";
import { itemStuddedHelmet } from "./tier1/ItemStuddedHelmet";
import { itemBerserkersHelmet } from "./tier2/ItemBerserkersHelmet";
import { itemDarkWizardHat } from "./tier2/ItemDarkWizardHat";
import { itemGladiatorHelmet } from "./tier2/ItemGladiatorHelmet";
import { itemMysticVeil } from "./tier2/ItemMysticVeil";
import { itemSorcerersVeil } from "./tier2/ItemSorcerersVeil";
import { itemVikingHelmet } from "./tier2/ItemVikingHelmet";
import { itemAmethystHelmet } from "./tier3/ItemAmethystHelmet";
import { itemDeathsHelmet } from "./tier3/ItemDeathsHelmet";
import { itemGlacialCrown } from "./tier3/ItemGlacialCrown";
import { itemGuardianHelmet } from "./tier3/ItemGuardianHelmet";
import { itemIroncladHelmet } from "./tier3/ItemIroncladHelmet";
import { itemSaviorsHelmet } from "./tier3/ItemSaviorsHelmet";
import { itemWingHelmet } from "./tier3/ItemWingHelmet";
import { itemBloodfireHelmet } from "./tier4/ItemBloodfireHelmet";
import { itemCrownHelmet } from "./tier4/ItemCrownHelmet";
import { itemJadeEmperorsHelm } from "./tier4/ItemJadeEmperorsHelm";
import { itemRoyalHelmet } from "./tier4/ItemRoyalHelmet";
import { itemRoyalKnightHelmet } from "./tier4/ItemRoyalKnightHelmet";
import { itemSpellcastersHat } from "./tier4/ItemSpellcastersHat";

export const helmetsBlueprintIndex = {
  [HelmetsBlueprint.ArabicHelmet]: itemArabicHelmet,
  [HelmetsBlueprint.BerserkersHelmet]: itemBerserkersHelmet,
  [HelmetsBlueprint.BrassHelmet]: itemBrassHelmet,
  [HelmetsBlueprint.Cap]: itemCap,
  [HelmetsBlueprint.DarkWizardHat]: itemDarkWizardHat,
  [HelmetsBlueprint.DeathsHelmet]: itemDeathsHelmet,
  [HelmetsBlueprint.FarmersHelmet]: itemFarmersHelmet,
  [HelmetsBlueprint.GladiatorHelmet]: itemGladiatorHelmet,
  [HelmetsBlueprint.InfantryHelmet]: itemInfantryHelmet,
  [HelmetsBlueprint.IronHelmet]: itemIronHelmet,
  [HelmetsBlueprint.LeatherHelmet]: itemLeatherHelmet,
  [HelmetsBlueprint.RedHoodie]: itemRedHoodie,
  [HelmetsBlueprint.RoyalHelmet]: itemRoyalHelmet,
  [HelmetsBlueprint.RoyalKnightHelmet]: itemRoyalKnightHelmet,
  [HelmetsBlueprint.SaviorsHelmet]: itemSaviorsHelmet,
  [HelmetsBlueprint.SoldiersHelmet]: itemSoldiersHelmet,
  [HelmetsBlueprint.StuddedHelmet]: itemStuddedHelmet,
  [HelmetsBlueprint.Turban]: itemTurban,
  [HelmetsBlueprint.VikingHelmet]: itemVikingHelmet,
  [HelmetsBlueprint.WingHelmet]: itemWingHelmet,
  [HelmetsBlueprint.WizardHat]: itemWizardHat,
  [HelmetsBlueprint.AmethystHelmet]: itemAmethystHelmet,
  [HelmetsBlueprint.BloodfireHelmet]: itemBloodfireHelmet,
  [HelmetsBlueprint.BrassHelmet]: itemBrassHelmet,
  [HelmetsBlueprint.CrownHelmet]: itemCrownHelmet,
  [HelmetsBlueprint.GlacialCrown]: itemGlacialCrown,
  [HelmetsBlueprint.GuardianHelmet]: itemGuardianHelmet,
  [HelmetsBlueprint.HuntersCap]: itemHuntersCap,
  [HelmetsBlueprint.IroncladHelmet]: itemIroncladHelmet,
  [HelmetsBlueprint.JadeEmperorsHelm]: itemJadeEmperorsHelm,
  [HelmetsBlueprint.MysticVeil]: itemMysticVeil,
  [HelmetsBlueprint.SorcerersVeil]: itemSorcerersVeil,
  [HelmetsBlueprint.SpellcastersHat]: itemSpellcastersHat,
};
