import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverBoots: IEquippableArmorBlueprint = {
  key: BootsBlueprint.SilverBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/silver-boots.png",
  name: "Silver Boots",
  description: "Silver boots are a part of a set made of Silver.",
  defense: 10,
  weight: 0.6,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 65,
};
