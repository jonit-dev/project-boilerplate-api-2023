import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGlacialLegs: IEquippableLightArmorTier3Blueprint = {
  key: LegsBlueprint.GlacialLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/glacial-legs.png",
  name: "Glacial Legs",
  description:
    "The Glacial Legs are a set of formidable leg armor that is said to have been forged from the icy glaciers of the far north",
  weight: 1,
  defense: 16,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Legs],
  equippedBuff: [
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
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 5,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max health flowing through your body. (+5% MaxHealth)",
          deactivation: "You feel the power of max health leaving your body. (-5% MaxHealth)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases strength by 5% and max health by 5% respectively",
};
