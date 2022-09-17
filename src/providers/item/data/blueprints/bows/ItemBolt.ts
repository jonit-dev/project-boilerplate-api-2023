import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBolt: Partial<IItem> = {
  key: RangedBlueprint.Bolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "bows/bolt.png",
  textureKey: "bolt",
  name: "Bolt",
  description: "A crossbow bolt.",
  attack: 2,
  weight: 0.02,
  allowedEquipSlotType: [ItemSlotType.Accessory],
};
