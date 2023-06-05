import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpellcastersHat: IEquippableLightArmorTier4Blueprint = {
  key: HelmetsBlueprint.SpellcastersHat,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/spellcasters-hat.png",
  name: "Spellcaster's Hat",
  description:
    "The Spellcaster's Hat is a distinctive and stylish headpiece that is favored by those who practice the arcane arts.",
  weight: 1,
  defense: 17,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Head],
  equippedBuff: [
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
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Magic,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of magic flowing through your body. (+10% magic)",
          deactivation: "You feel the power of magic health leaving your body. (-10% magic)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases max mana by 10% and magic by 10% respectively",
};
