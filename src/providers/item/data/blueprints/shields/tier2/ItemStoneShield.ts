import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStoneShield: IEquippableArmorTier2Blueprint = {
  key: ShieldsBlueprint.StoneShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/stone-shield.png",
  name: "Stone Shield",
  description: "A heavy shield made of stone that provides excellent defense but limits mobility",
  defense: 20,
  tier: 2,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 60,
};
