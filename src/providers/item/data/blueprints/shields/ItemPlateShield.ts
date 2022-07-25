import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const ItemPlateShield: Partial<IItem> = {
  key: ShieldsBlueprint.PlateShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/plate-shield.png",
  textureKey: "plate-shield",
  name: "Plate Shield",
  description: "A large metal shield.",
  defense: 10,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
