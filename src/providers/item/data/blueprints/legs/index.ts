import { LegsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemLeatherLegs } from "./tier0/ItemLeatherLegs";
import { itemStuddedLegs } from "./tier1/ItemStuddedLegs";
import { itemBronzeLegs } from "./tier2/ItemBronzeLegs";
import { itemFalconsLegs } from "./tier3/ItemFalconsLegs";
import { itemGlacialLegs } from "./tier3/ItemGlacialLegs";
import { itemBloodfireLegs } from "./tier4/ItemBloodfireLegs";
import { itemGoldenLegs } from "./tier4/ItemGoldenLegs";
import { itemMithrilLegs } from "./tier4/ItemMithrilLegs";

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
