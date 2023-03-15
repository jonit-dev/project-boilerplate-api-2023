import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBanditShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.BanditShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/bandit-shield.png",
  name: "Bandit Shield",
  description:
    "The Bandit Shield is a rugged and functional piece of defensive equipment often used by thieves, brigands, and other outlaws who live by the sword.",
  weight: 1,
  defense: 17,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
