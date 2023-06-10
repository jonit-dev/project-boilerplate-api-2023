import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFalconsArmor: IEquippableArmorTier4Blueprint = {
  key: ArmorsBlueprint.FalconsArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/falcons-armor.png",
  name: "Falcon's Armor",
  description:
    "Crafted from lightweight and durable materials, such as leather or feathers, Falcon's Armor is designed to provide we wearer a reasonable amount of protection against physical attacks.",
  defense: 33,
  tier: 4,
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 180,
  equippedBuff: {
    type: CharacterBuffType.Skill,
    trait: BasicAttribute.Resistance,
    buffPercentage: 5,
    durationType: CharacterBuffDurationType.Permanent,
    options: {
      messages: {
        activation: "You feel the power of resistance flowing through your body. (+5% resistance)",
        deactivation: "You feel the power of resistance leaving your body. (-5% resistance)",
      },
    },
  },
  equippedBuffDescription: "Increases resistance by 5%",
};
