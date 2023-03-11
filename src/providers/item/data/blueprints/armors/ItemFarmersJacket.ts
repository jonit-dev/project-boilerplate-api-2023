import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFarmersJacket: Partial<IItem> = {
  key: ArmorsBlueprint.FarmersJacket,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/farmers-jacket.png",
  name: "Farmers Jacket",
  description:
    "Crafted from durable and breathable materials such as cotton or wool, Farmers Jackets are designed to be comfortable and practical for use during physical labor.",
  defense: 4,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 0,
};
