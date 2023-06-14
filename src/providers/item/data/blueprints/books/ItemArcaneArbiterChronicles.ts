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
export const itemArcaneArbiterChronicles: IEquippableItemBlueprint = {
  key: BooksBlueprint.ArcaneArbiterChronicles,
  type: ItemType.Accessory,
  subType: ItemSubType.Book,
  textureAtlas: "items",
  texturePath: "books/arcane-arbiter-chronicles.png",
  name: "Arcane Arbiter Chronicles",
  description:
    "Bound in enchanted moonlight silk, holds ancient wisdom for magical accuracy and defense. It is said to bestow a reader with a significant boost to their attack and defense abilities.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 85,
  canSell: false,
  equippedBuff: [
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxMana,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max mana flowing through your body. (+5%  max mana)",
          deactivation: "You feel the power of  max mana leaving your body. (-5%  max mana)",
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
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of strength flowing through your body. (+5% strength)",
          deactivation: "You feel the power of strength leaving your body. (-5% strength)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases  max mana by 5%, magic by 5% and strength by 5% respectively",
};
