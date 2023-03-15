import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.StuddedShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/studded-shield.png",
  name: "Studded Shield",
  description: "A wooden shield covered in leather and metal studs.",
  defense: 10,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 41,
};
