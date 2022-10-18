import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemChainGloves: Partial<IItem> = {
  key: GlovesBlueprint.ChainGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/chain-gloves.png",

  name: "Chain Gloves",
  description: "A pair of metal chain gloves.",
  defense: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
