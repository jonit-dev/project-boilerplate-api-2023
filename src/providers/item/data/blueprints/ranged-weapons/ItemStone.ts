import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStone: Partial<IItem> = {
  key: RangedWeaponsBlueprint.Stone,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/stone.png",
  name: "Stone",
  description: "A stone.",
  attack: 3,
  weight: 0.15,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 1,
  canSell: false,
};
