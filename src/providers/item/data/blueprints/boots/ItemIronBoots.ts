import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronBoots: Partial<IItem> = {
  key: BootsBlueprint.IronBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/iron-boots.png",
  name: "Iron Boots",
  description: "An iron plated boot.",
  defense: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  sellPrice: 15,
};
