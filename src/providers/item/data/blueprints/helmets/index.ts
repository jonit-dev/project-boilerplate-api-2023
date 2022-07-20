import { HelmetBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCap } from "./ItemCap";
import { itemStuddedHelmet } from "./ItemStuddedHelmet";
import { itemTurban } from "./ItemTurban";
import { itemWingHelmet } from "./ItemWingHelmet";

export const helmetsBlueprintsIndex = {
  [HelmetBlueprint.WingHelmet]: itemWingHelmet,
  [HelmetBlueprint.Cap]: itemCap,
  [HelmetBlueprint.StuddedHelmet]: itemStuddedHelmet,
  [HelmetBlueprint.Turban]: itemTurban,
};
