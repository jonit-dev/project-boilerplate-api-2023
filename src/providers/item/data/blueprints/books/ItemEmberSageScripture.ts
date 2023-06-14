import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  IEquippableItemBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { BooksBlueprint } from "../../types/itemsBlueprintTypes";
export const itemEmberSageScripture: IEquippableItemBlueprint = {
  key: BooksBlueprint.EmberSageScripture,
  type: ItemType.Accessory,
  subType: ItemSubType.Book,
  textureAtlas: "items",
  texturePath: "books/ember-sage-scripture.png",
  name: "Ember Sage Scripture",
  description:
    "Etched into charred dragon scales, carries the powerful essence of fire magic. It is said to ignite a magical spark in the reader, increasing their attack abilities.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 37,
  equippedBuff: [
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxMana,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max mana flowing through your body. (+5% max mana)",
          deactivation: "You feel the power of max mana leaving your body. (-5% max mana)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Magic,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of magic flowing through your body. (+5% magic)",
          deactivation: "You feel the power of magic leaving your body. (-5% magic)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases max mana by 5% and magic by 5% respectively",
};
