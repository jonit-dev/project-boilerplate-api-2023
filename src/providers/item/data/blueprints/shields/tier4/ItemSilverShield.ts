import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSilverShield: IEquippableArmorTier4Blueprint = {
  key: ShieldsBlueprint.SilverShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/silver-shield.png",
  name: "Silver Shield",
  description: "An Shield made by the capricious artisan and is covered with silver.",
  defense: 30,
  tier: 4,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 65,
};
