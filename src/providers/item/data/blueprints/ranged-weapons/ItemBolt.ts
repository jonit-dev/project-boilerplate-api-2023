import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBolt: Partial<IItem> = {
  key: RangedWeaponsBlueprint.Bolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "ranged-weapons/bolt.png",
  name: "Bolt",
  description: "A crossbow bolt.",
  attack: 6,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  sellPrice: 0.5,
};
