import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableAccessoryTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronRing: IEquippableAccessoryTier1Blueprint = {
  key: AccessoriesBlueprint.IronRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/iron-ring.png",
  name: "Iron Ring",
  description:
    "A strong and durable ring forged from iron. It is a simple yet reliable piece of jewelry, often worn by those who value practicality and function over aesthetics.",
  attack: 5,
  defense: 2,
  tier: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 30,
  equippedBuff: {
    type: CharacterBuffType.Skill,
    trait: BasicAttribute.Resistance,
    buffPercentage: 2,
    durationType: CharacterBuffDurationType.Permanent,
    options: {
      messages: {
        activation: "You feel the power of resistance flowing through your body. (+2% resistance)",
        deactivation: "You feel the power of resistance leaving your body. (-2% resistance)",
      },
    },
  },
  equippedBuffDescription: "Increases resistance by 2%",
};
