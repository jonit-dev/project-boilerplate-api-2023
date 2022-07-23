import { HelmetBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBrassHelmet } from "./ItemBrassHelmet";
import { itemCap } from "./ItemCap";
import { itemSoldiersHelmet } from "./ItemSoldiersHelmet";
import { itemStuddedHelmet } from "./ItemStuddedHelmet";
import { itemTurban } from "./ItemTurban";
import { itemWingHelmet } from "./ItemWingHelmet";

export const helmetsBlueprintsIndex = {
  [HelmetBlueprint.WingHelmet]: itemWingHelmet,
  [HelmetBlueprint.Cap]: itemCap,
  [HelmetBlueprint.StuddedHelmet]: itemStuddedHelmet,
  [HelmetBlueprint.Turban]: itemTurban,
  [HelmetBlueprint.BrassHelmet]: itemBrassHelmet,
  [HelmetBlueprint.SoldiersHelmet]: itemSoldiersHelmet,
};
