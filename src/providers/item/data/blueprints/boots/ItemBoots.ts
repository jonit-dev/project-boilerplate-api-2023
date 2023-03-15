import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBoots: IEquippableArmorBlueprint = {
  key: BootsBlueprint.Boots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/boots.png",
  name: "Boots",
  description: "A simple leather boots.",
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 0,
};
