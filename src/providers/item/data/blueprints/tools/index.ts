import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemButchersKnife } from "./ItemButchersKnife";
import { itemCarpentersAxe } from "./ItemCarpentersAxe";
import { itemFishingRod } from "./ItemFishingRod";
import { itemPickaxe } from "./ItemPickaxe";
import { itemUseWithItemTest } from "./ItemUseWithItemTest";
import { itemUseWithTileTest } from "./ItemUseWithTileTest";

export const toolsBlueprintIndex = {
  [ToolsBlueprint.ButchersKnife]: itemButchersKnife,
  [ToolsBlueprint.CarpentersAxe]: itemCarpentersAxe,
  [ToolsBlueprint.FishingRod]: itemFishingRod,
  [ToolsBlueprint.Pickaxe]: itemPickaxe,
  [ToolsBlueprint.UseWithItemTest]: itemUseWithItemTest, //! UNIT TEST ONLY
  [ToolsBlueprint.UseWithTileTest]: itemUseWithTileTest, //! UNIT TEST ONLY
};
