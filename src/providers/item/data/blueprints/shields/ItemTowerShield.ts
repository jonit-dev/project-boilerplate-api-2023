import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemTowerShield: Partial<IItem> = {
  key: ShieldsBlueprint.TowerShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/tower-shield.png",
  name: "Tower Shield",
  description: "A massive shield that provides excellent defense but significantly limits mobility.",
  defense: 16,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 58,
};
