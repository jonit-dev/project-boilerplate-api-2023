import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRope: Partial<IItemUseWith> = {
  key: CraftingResourcesBlueprint.Rope,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/rope.png",
  name: "Rope",
  description: "A simple rope used to escape dungeons.",
  weight: 0.7,
  maxStackSize: 15,
  basePrice: 0.8,
};
