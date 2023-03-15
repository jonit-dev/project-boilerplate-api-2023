import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenBoots: IEquippableArmorBlueprint = {
  key: BootsBlueprint.GoldenBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/golden-boots.png",
  name: "Golden Boots",
  description: "An boot made of gold. It is a part of the Golden set.",
  defense: 16,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 89,
};
