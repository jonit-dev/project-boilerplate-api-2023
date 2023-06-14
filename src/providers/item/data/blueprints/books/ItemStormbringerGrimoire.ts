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
export const itemStormbringerGrimoire: IEquippableItemBlueprint = {
  key: BooksBlueprint.StormbringerGrimoire,
  type: ItemType.Accessory,
  subType: ItemSubType.Book,
  textureAtlas: "items",
  texturePath: "books/stormbringer-grimoire.png",
  name: "Stormbringer Grimoire",
  description:
    "Composed of pure lightning, resonates with a storm's might. Reading this book is said to bolster one's electric magic abilities, as well as their attack power.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 80,
  canSell: false,
  equippedBuff: [
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.AttackIntervalSpeed,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation:
            "You feel the power of attack interval speed flowing through your body. (+5% attack interval speed)",
          deactivation: "You feel the power of attack interval speed leaving your body. (-5% attack interval speed)",
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
      trait: BasicAttribute.Dexterity,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of dexterity flowing through your body. (+5% dexterity)",
          deactivation: "You feel the power of dexterity leaving your body. (-5% dexterity)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases attack interval speed by 5%, magic by 5% and dexterity by 5% respectively",
};
