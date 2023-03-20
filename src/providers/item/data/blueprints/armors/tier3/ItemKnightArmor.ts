import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKnightArmor: IEquippableArmorTier3Blueprint = {
  key: ArmorsBlueprint.KnightArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/knight-armor.png",
  name: "Knight Armor",
  description:
    "Crafted from durable and sturdy materials such as steel or iron, Knight Armor is designed to offer a high degree of protection against physical attacks, while also providing a regal and imposing appearance.",
  weight: 3,
  defense: 29,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
