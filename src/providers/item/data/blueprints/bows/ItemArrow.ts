import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BowsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemArrow: Partial<IItem> = {
  key: BowsBlueprint.Arrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "bows/arrow.png",
  textureKey: "arrow",
  name: "Arrow",
  description: "An iron head arrow.",
  attack: 1,
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.Accessory],
};
