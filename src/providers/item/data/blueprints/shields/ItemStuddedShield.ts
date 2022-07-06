import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemStuddedShield: Partial<IItem> = {
  key: "studded-shield",
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/studded-shield.png",
  textureKey: "studded-shield",
  name: "studded-shield",
  description: "A wooden shield covered in lether and metal studs.",
  defense: 5,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
