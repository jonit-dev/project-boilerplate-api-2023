import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBanditShield: IEquippableArmorTier1Blueprint = {
  key: ShieldsBlueprint.BanditShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/bandit-shield.png",
  name: "Bandit Shield",
  description:
    "The Bandit Shield is a rugged and functional piece of defensive equipment often used by thieves, brigands, and other outlaws who live by the sword.",
  weight: 1,
  defense: 15,
  tier: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
