import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedBlueprint } from "../../types/itemsBlueprintTypes";

export const itemArrow: Partial<IItem> = {
  key: RangedBlueprint.Arrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "ranged-weapons/arrow.png",
  textureKey: "arrow",
  name: "Arrow",
  description: "An iron head arrow.",
  attack: 4,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
};
