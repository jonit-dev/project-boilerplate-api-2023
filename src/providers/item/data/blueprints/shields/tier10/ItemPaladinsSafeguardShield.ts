import { IEquippableArmorTier10Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPaladinsSafeguardShield: IEquippableArmorTier10Blueprint = {
  key: ShieldsBlueprint.PaladinsSafeguardShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/paladins-safeguard-shield.png",
  name: "Paladins Safeguard Shield",
  description:
    "A revered shield passed down among holy warriors, its red cross offers divine protection and wards off evil.",
  weight: 1,
  defense: 78,
  tier: 10,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
