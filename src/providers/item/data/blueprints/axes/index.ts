import { AxesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemAxe } from "./ItemAxe";
import { itemBardiche } from "./itemBardiche";
import { itemDoubleAxe } from "./itemDoubleAxe";
import { itemFrostDoubleAxe } from "./ItemFrostDoubleAxe";
import { itemYetiHalberd } from "./ItemYetiHalberd";

export const axesBlueprintIndex = {
  [AxesBlueprint.Axe]: itemAxe,
  [AxesBlueprint.Bardiche]: itemBardiche,
  [AxesBlueprint.DoubleAxe]: itemDoubleAxe,
  [AxesBlueprint.FrostDoubleAxe]: itemFrostDoubleAxe,
  [AxesBlueprint.YetiHalberd]: itemYetiHalberd,
};
