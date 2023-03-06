import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStoneShield: Partial<IItem> = {
  key: ShieldsBlueprint.StoneShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/stone-shield.png",
  name: "Stone Shield",
  description: "A heavy shield made of stone that provides excellent defense but limits mobility",
  defense: 16,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 60,
};
