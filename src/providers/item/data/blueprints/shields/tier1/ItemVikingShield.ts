import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemVikingShield: IEquippableArmorTier1Blueprint = {
  key: ShieldsBlueprint.VikingShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/viking-shield.png",
  name: "Viking Shield",
  description:
    "It consists of thin planking, which forms a circular shape. In the middle is a dome of iron to protect the shield bearer's hand.",
  defense: 15,
  tier: 1,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 49,
};
