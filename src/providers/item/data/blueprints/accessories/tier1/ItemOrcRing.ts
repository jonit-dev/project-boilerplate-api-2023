import { IEquippableAccessoryTier1Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemOrcRing: IEquippableAccessoryTier1Blueprint = {
  key: AccessoriesBlueprint.OrcRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/orc-ring.png",
  name: "Orc Ring",
  description:
    "A rough and crude ring made by orcs, a race of brutish and warlike creatures. It is a symbol of strength and ferocity, often worn by orcs as a sign of their martial prowess.",
  attack: 4,
  defense: 1,
  tier: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 35,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: 2,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of resistance flowing through your body. (+2% resistance)",
          deactivation: "You feel the power of resistance leaving your body. (-2% resistance)",
        },
      },
    },
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 3,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max health flowing through your body. (+3% MaxHealth)",
          deactivation: "You feel the power of max health leaving your body. (-3% MaxHealth)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases resistance by 2% and max health by 3% respectively",
};
