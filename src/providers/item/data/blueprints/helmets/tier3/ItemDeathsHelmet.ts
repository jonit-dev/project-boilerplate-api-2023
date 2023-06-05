import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDeathsHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.DeathsHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/deaths-helmet.png",
  name: "Deaths Helmet",
  description: "This helmet is made from parts of a corrupted material.",
  defense: 13,
  weight: 0.7,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 41,
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
  ],
  equippedBuffDescription: "Increases strength by 5% and resistance by 5% respectively",
};
