import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronBoots: IEquippableArmorBlueprint = {
  key: BootsBlueprint.IronBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/iron-boots.png",
  name: "Iron Boots",
  description: "An iron plated boot.",
  defense: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 45,
};
