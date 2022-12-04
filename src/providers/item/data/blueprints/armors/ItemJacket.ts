import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJacket: Partial<IItem> = {
  key: ArmorsBlueprint.Jacket,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/jacket.png",
  name: "Jacket",
  description: "You see a jacket.",
  defense: 2,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 0,
};
