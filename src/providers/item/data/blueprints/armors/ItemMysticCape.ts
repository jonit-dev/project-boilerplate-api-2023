import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMysticCape: Partial<IItem> = {
  key: ArmorsBlueprint.MysticCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/mystic-cape.png",
  name: "Mystic Cape",
  description:
    "The cape is said to be imbued with powerful enchantments that enhance the wearer's magical abilities and provide protection against magical attacks.",
  defense: 18,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 100,
};
