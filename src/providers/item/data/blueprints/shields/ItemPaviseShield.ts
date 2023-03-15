import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPaviseShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.PaviseShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/pavise-shield.png",
  name: "Pavise Shield",
  description: "A heavy shield that provides excellent defense.",
  defense: 19,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 54,
};
