import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemStuddedArmor: Partial<IItem> = {
  key: "studded-armor",
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/studded-armor.png",
  textureKey: "studded-armor",
  name: "Studded Armor",
  description: "A basic leather armor with metal studs.",
  defense: 10,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.Torso],
};