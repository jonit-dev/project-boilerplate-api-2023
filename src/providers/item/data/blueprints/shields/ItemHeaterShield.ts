import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHeaterShield: Partial<IItem> = {
  key: ShieldsBlueprint.HeaterShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/heater-shield.png",
  name: "Heater Shield",
  description: "A lightweight shield that provides good protection and allows for quick movement.",
  defense: 15,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 52,
};
