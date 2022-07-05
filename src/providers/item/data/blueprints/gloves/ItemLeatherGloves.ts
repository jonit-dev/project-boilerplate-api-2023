import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemLeatherGloves: Partial<IItem> = {
  key: "leather-gloves",
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/leather-gloves.png",
  textureKey: "leather-gloves",
  name: "leather-gloves",
  description: "A pair of simple leather gloves.",
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};