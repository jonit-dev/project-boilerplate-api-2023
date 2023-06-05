import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSorcerersCape: IEquippableArmorTier3Blueprint = {
  key: ArmorsBlueprint.SorcerersCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/sorcerers-cape.png",
  name: "Sorcerer's Cape",
  description:
    "Crafted from rare and exotic materials such as moonstone, star metal, or etherium, Sorcerer's Cape is adorned with intricate designs and symbols of arcane magic.",
  weight: 1,
  defense: 25,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
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
