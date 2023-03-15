import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronArmor: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.IronArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/iron-armor.png",
  name: "Iron Armor",
  description: "An iron plated armor.",
  defense: 14,
  weight: 6,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 81,
};
