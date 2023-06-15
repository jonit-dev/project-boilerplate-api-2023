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
export const itemMysticWardenCodex: IEquippableItemBlueprint = {
  key: BooksBlueprint.MysticWardenCodex,
  type: ItemType.Accessory,
  subType: ItemSubType.Book,
  textureAtlas: "items",
  texturePath: "books/mystic-warden-codex.png",
  name: "Mystic Warden Codex",
  description:
    "Adorned with the sacred rune of the Warden, is said to bestow its reader with enhanced defense abilities and a deeper understanding of mystical barriers.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 30,
  equippedBuff: [
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max health flowing through your body. (+5% max health)",
          deactivation: "You feel the power of max health leaving your body. (-5% max health)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.MagicResistance,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of magic resistance flowing through your body. (+5% magic resistance)",
          deactivation: "You feel the power of magic resistance leaving your body. (-5% magic resistance)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases max health by 5% and magic resistance by 5% respectively",
};
