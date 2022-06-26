import { HelmetBlueprint } from "../../types/blueprintTypes";
import { itemWingHelmet } from "./ItemWingHelmet";
import { itemCap } from "./ItemCap";
import { itemStuddedHelmet } from "./ItemStuddedHelmet";
import { itemTurban } from "./ItemTurban";

export const helmetsBlueprintsIndex = {
  [HelmetBlueprint.WingHelmet]: itemWingHelmet,
  [HelmetBlueprint.Cap]: itemCap,
  [HelmetBlueprint.StuddedHelmet]: itemStuddedHelmet,
  [HelmetBlueprint.Turban]: itemTurban,
};
