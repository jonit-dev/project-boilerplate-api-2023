import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.SilverShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/silver-shield.png",
  name: "Silver Shield",
  description: "An Shield made by the capricious artisan and is covered with silver.",
  defense: 17,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 65,
};
