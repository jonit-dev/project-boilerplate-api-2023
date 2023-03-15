import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemVikingShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.VikingShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/viking-shield.png",
  name: "Viking Shield",
  description:
    "It consists of thin planking, which forms a circular shape. In the middle is a dome of iron to protect the shield bearer's hand.",
  defense: 12,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 49,
};
