import { LegsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBloodfireLegs } from "./ItemBloodfireLegs";
import { itemBronzeLegs } from "./ItemBronzeLegs";
import { itemFalconsLegs } from "./ItemFalconsLegs";
import { itemGlacialLegs } from "./ItemGlacialLegs";
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
  [LegsBlueprint.BloodfireLegs]: itemBloodfireLegs,
  [LegsBlueprint.FalconsLegs]: itemFalconsLegs,
  [LegsBlueprint.GlacialLegs]: itemGlacialLegs,
};
