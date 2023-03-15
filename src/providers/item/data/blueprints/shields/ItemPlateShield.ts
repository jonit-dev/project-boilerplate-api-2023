import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPlateShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.PlateShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/plate-shield.png",
  name: "Plate Shield",
  description: "A large metal shield.",
  defense: 20,
  weight: 2.3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 77,
};
