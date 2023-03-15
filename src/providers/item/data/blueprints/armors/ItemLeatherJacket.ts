import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeatherJacket: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.LeatherJacket,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/leather-jacket.png",

  name: "Leather Jacket",
  description: "A jacket made of treated leather.",
  defense: 5,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 45,
};
