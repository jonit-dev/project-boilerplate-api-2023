import { LegsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBronzeLegs } from "./ItemBronzeLegs";
import { itemGoldenLegs } from "./ItemGoldenLegs";
import { itemLeatherLegs } from "./ItemLeatherLegs";
import { itemMithrilLegs } from "./ItemMithrilLegs";
import { itemStuddedLegs } from "./ItemStuddedLegs";

export const legsBlueprintIndex = {
  [LegsBlueprint.LeatherLegs]: itemLeatherLegs,
  [LegsBlueprint.StuddedLegs]: itemStuddedLegs,
  [LegsBlueprint.BronzeLegs]: itemBronzeLegs,
  [LegsBlueprint.GoldenLegs]: itemGoldenLegs,
  [LegsBlueprint.MithrilLegs]: itemMithrilLegs,
};
