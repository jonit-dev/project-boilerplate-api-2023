import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStone: Partial<IItem> = {
  key: RangedBlueprint.Stone,
  type: ItemType.Weapon,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "ranged-weapons/stone.png",
  textureKey: "stone",
  name: "Stone",
  description: "A stone.",
  attack: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
};
