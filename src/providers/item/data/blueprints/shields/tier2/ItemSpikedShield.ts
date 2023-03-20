import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpikedShield: IEquippableArmorTier2Blueprint = {
  key: ShieldsBlueprint.SpikedShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/spiked-shield.png",
  name: "Spiked Shield",
  description: "A shield with spikes on the edges that deals damage to enemies that attack the wielder.",
  defense: 21,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 70,
};
