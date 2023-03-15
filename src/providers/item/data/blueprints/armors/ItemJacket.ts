import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJacket: IEquippableArmorBlueprint = {
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
