import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAmuletOfLuck: Partial<IItem> = {
  key: AccessoriesBlueprint.AmuletOfLuck,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/amulet-of-luck.png",
  name: "Amulet Of Luck",
  description:
    "Wearing this amulet is said to increase the wearer's chances of success in all their endeavors, from combat to crafting and beyond",
  attack: 0,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 5000,
};
