import { IEquippableItemBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronRing: IEquippableItemBlueprint = {
  key: AccessoriesBlueprint.IronRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/iron-ring.png",
  name: "Iron Ring",
  description:
    "A strong and durable ring forged from iron. It is a simple yet reliable piece of jewelry, often worn by those who value practicality and function over aesthetics.",
  attack: 4,
  defense: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 30,
};
