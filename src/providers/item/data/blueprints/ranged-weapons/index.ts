import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemArrow } from "./ItemArrow";
import { itemBolt } from "./ItemBolt";
import { itemBow } from "./ItemBow";
import { itemCrossbow } from "./ItemCrossbow";
import { itemFrostBow } from "./ItemFrostBow";
import { itemFrostCrossbow } from "./ItemFrostCrossbow";
import { itemOrcishBow } from "./ItemOrcishBow";
import { itemSlingshot } from "./ItemSlingshot";
import { itemStone } from "./ItemStone";

export const rangedWeaponsBlueprintIndex = {
  [RangedWeaponsBlueprint.Slingshot]: itemSlingshot,
  [RangedWeaponsBlueprint.Stone]: itemStone,
  [RangedWeaponsBlueprint.Arrow]: itemArrow,
  [RangedWeaponsBlueprint.Crossbow]: itemCrossbow,
  [RangedWeaponsBlueprint.Bolt]: itemBolt,
  [RangedWeaponsBlueprint.Bow]: itemBow,
  [RangedWeaponsBlueprint.OrcishBow]: itemOrcishBow,
  [RangedWeaponsBlueprint.FrostBow]: itemFrostBow,
  [RangedWeaponsBlueprint.FrostCrossbow]: itemFrostCrossbow,
};
