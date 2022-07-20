import { AxesBlueprint } from "../../types/blueprintTypes";
import { itemAxe } from "./ItemAxe";
import { itemBardiche } from "./itemBardiche";
import { itemDoubleAxe } from "./itemDoubleAxe";

export const axeBlueprintIndex = {
  [AxesBlueprint.Axe]: itemAxe,
  [AxesBlueprint.Bardiche]: itemBardiche,
  [AxesBlueprint.DoubleAxe]: itemDoubleAxe,
};
