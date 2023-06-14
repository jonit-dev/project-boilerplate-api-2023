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
export const itemFrostWraithTome: IEquippableItemBlueprint = {
  key: BooksBlueprint.FrostWraithTome,
  type: ItemType.Accessory,
  subType: ItemSubType.Book,
  textureAtlas: "items",
  texturePath: "books/frost-wraith-tome.png",
  name: "Frost Wraith Tome",
  description:
    "Bound in the hide of a frost wraith, grants the reader an unyielding resistance against cold damage. Its icy teachings are believed to increase both magic and physical defense.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 75,
  canSell: false,
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
  equippedBuffDescription: "Increases max health by 5%, resistance by 5% and magic resistance by 5% respectively",
};
