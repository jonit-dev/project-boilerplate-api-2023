import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalBoots: Partial<IItem> = {
  key: BootsBlueprint.RoyalBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/royal-boots.png",
  name: "Royal Boots",
  description: "The Royal Boots are made with fine and high quality materials.",
  defense: 12,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  sellPrice: 15,
};
