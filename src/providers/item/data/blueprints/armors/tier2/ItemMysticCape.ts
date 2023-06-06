import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMysticCape: IEquippableArmorTier2Blueprint = {
  key: ArmorsBlueprint.MysticCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/mystic-cape.png",
  name: "Mystic Cape",
  description:
    "The cape is said to be imbued with powerful enchantments that enhance the wearer's magical abilities and provide protection against magical attacks.",
  defense: 20,
  tier: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 100,
  equippedBuff: {
    type: CharacterBuffType.CharacterAttribute,
    trait: CharacterAttributes.MaxMana,
    buffPercentage: 5,
    durationType: CharacterBuffDurationType.Permanent,
    options: {
      messages: {
        activation: "You feel the power of max mana flowing through your body. (+5% MaxMana)",
        deactivation: "You feel the power of max mana leaving your body. (-5% MaxMana)",
      },
    },
  },
  equippedBuffDescription: "Increases max mana by 5%",
};
