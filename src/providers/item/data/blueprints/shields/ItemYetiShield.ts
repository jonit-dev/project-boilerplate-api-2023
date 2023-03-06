import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemYetiShield: Partial<IItem> = {
  key: ShieldsBlueprint.YetiShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/yeti-shield.png",
  name: "Yeti's Shield",
  description: "A rare shield used by Yetis, against the frost island invaders.",
  defense: 18,
  weight: 1.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 57,
};
