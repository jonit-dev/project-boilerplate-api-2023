import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedBoots: Partial<IItem> = {
  key: BootsBlueprint.StuddedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/studded-boots.png",

  name: "Studded Boots",
  description: "A boot made with leather and metal studs.",
  defense: 4,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
};
