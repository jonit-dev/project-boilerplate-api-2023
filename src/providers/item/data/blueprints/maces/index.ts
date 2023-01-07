import { MacesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemClub } from "./ItemClub";
import { itemMace } from "./ItemMace";
import { itemSpikedClub } from "./ItemSpikedClub";
import { itemSpikedMace } from "./ItemSpikedMace";

export const macesBlueprintIndex = {
  [MacesBlueprint.Club]: itemClub,
  [MacesBlueprint.Mace]: itemMace,
  [MacesBlueprint.SpikedClub]: itemSpikedClub,
  [MacesBlueprint.SpikedMace]: itemSpikedMace,
};
