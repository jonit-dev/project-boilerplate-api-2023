import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWolfToothChain: Partial<IItem> = {
  key: AccessoriesBlueprint.WolfToothChain,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/wolf-tooth-chain.png",
  name: "Wolf Tooth Chain",
  description:
    "A necklace made of chain links with wolf teeth strung along the length of the chain. It is often worn as a symbol of strength and ferocity.",
  attack: 1,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 32,
};
