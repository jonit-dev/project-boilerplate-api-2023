import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemButchersKnife } from "./ItemButchersKnife";
import { itemCarpentersAxe } from "./ItemCarpentersAxe";
import { itemFishingRod } from "./ItemFishingRod";
import { itemPickaxe } from "./ItemPickaxe";
import { itemUseWithTest } from "./ItemUseWithTest";

export const toolsBlueprintIndex = {
  [ToolsBlueprint.ButchersKnife]: itemButchersKnife,
  [ToolsBlueprint.CarpentersAxe]: itemCarpentersAxe,
  [ToolsBlueprint.FishingRod]: itemFishingRod,
  [ToolsBlueprint.Pickaxe]: itemPickaxe,
  [ToolsBlueprint.UseWithTest]: itemUseWithTest,
};
