import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPlateBoots: Partial<IItem> = {
  key: BootsBlueprint.PlateBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/plate-boots.png",
  name: "Plate Boots",
  description: "A boot made with metal plates. These, too, are part of  plate armor.",
  defense: 9,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  sellPrice: 20,
};
