import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpellcastersCape: IEquippableArmorTier4Blueprint = {
  key: ArmorsBlueprint.SpellcastersCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/spellcasters-cape.png",
  name: "Spellcasters Cape",
  description:
    "Crafted from rare and exotic materials such as moonstone, star metal, or etherium, Spellcaster's Cape is adorned with intricate designs and symbols of arcane magic.",
  weight: 0.5,
  defense: 30,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Torso],
  equippedBuff: [
    {
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
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxMana,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max mana flowing through your body. (+10% MaxMana)",
          deactivation: "You feel the power of max mana leaving your body. (-10% MaxMana)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases resistance by 5% and max mana by 10% respectively",
};
