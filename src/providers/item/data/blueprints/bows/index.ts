import { RangedBlueprint } from "../../types/itemsBlueprintTypes";
import { itemArrow } from "./ItemArrow";
import { itemBolt } from "./ItemBolt";
import { itemBow } from "./ItemBow";
import { itemCrossbow } from "./ItemCrossbow";
import { itemOrcishBow } from "./ItemOrcishBow";
import { itemSlingshot } from "./ItemSlingshot";
import { itemStone } from "./ItemStone";

export const bowsBlueprintIndex = {
  [RangedBlueprint.Slingshot]: itemSlingshot,
  [RangedBlueprint.Stone]: itemStone,
  [RangedBlueprint.Arrow]: itemArrow,
  [RangedBlueprint.Crossbow]: itemCrossbow,
  [RangedBlueprint.Bolt]: itemBolt,
  [RangedBlueprint.Bow]: itemBow,
  [RangedBlueprint.OrcishBow]: itemOrcishBow,
};
