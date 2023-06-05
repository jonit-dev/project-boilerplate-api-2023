import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableAccessoryTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGlacialRing: IEquippableAccessoryTier1Blueprint = {
  key: AccessoriesBlueprint.GlacialRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/glacial-ring.png",
  name: "Glacial Ring",
  description:
    "The Glacial Ring is a unique and powerful piece of jewelry that is said to have been crafted from the frozen glaciers of the far north.",
  weight: 1,
  attack: 6,
  defense: 5,
  tier: 1,
  allowedEquipSlotType: [ItemSlotType.Ring],
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
      buffPercentage: 3,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max mana flowing through your body. (+3% MaxMana)",
          deactivation: "You feel the power of max mana leaving your body. (-3% MaxMana)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases resistance by 5% and max mana by 3% respectively",
};
