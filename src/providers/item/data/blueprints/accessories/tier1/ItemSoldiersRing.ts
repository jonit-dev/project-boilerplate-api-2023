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

export const itemSoldiersRing: IEquippableAccessoryTier1Blueprint = {
  key: AccessoriesBlueprint.SoldiersRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/soldiers-ring.png",
  name: "Soldiers Ring",
  description:
    "A simple and utilitarian ring worn by soldiers and warriors. It is a symbol of loyalty and service, and is often given as a token of honor or recognition.",
  attack: 5,
  defense: 3,
  tier: 1,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 30,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: 3,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of resistance flowing through your body. (+3% resistance)",
          deactivation: "You feel the power of resistance leaving your body. (-3% resistance)",
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
  equippedBuffDescription: "Increases resistance by 3% and max health by 3% respectively",
};
