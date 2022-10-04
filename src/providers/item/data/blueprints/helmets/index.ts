import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBrassHelmet } from "./ItemBrassHelmet";
import { itemCap } from "./ItemCap";
import { itemSoldiersHelmet } from "./ItemSoldiersHelmet";
import { itemStuddedHelmet } from "./ItemStuddedHelmet";
import { itemTurban } from "./ItemTurban";
import { itemWingHelmet } from "./ItemWingHelmet";

export const helmetsBlueprintsIndex = {
  [HelmetsBlueprint.WingHelmet]: itemWingHelmet,
  [HelmetsBlueprint.Cap]: itemCap,
  [HelmetsBlueprint.StuddedHelmet]: itemStuddedHelmet,
  [HelmetsBlueprint.Turban]: itemTurban,
  [HelmetsBlueprint.BrassHelmet]: itemBrassHelmet,
  [HelmetsBlueprint.SoldiersHelmet]: itemSoldiersHelmet,
};
