import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalKnightHelmet: IEquippableLightArmorTier4Blueprint = {
  key: HelmetsBlueprint.RoyalKnightHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/royal-knight-helmet.png",
  name: "Royal Knight Helmet",
  description: "The Royal Knight Helmet have a red plumage on top and covers entire head with slits for eyes.",
  defense: 18,
  tier: 4,
  weight: 2.4,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 85,
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of strength flowing through your body. (+10% strength)",
          deactivation: "You feel the power of strength leaving your body. (-10% strength)",
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
  equippedBuffDescription: "Increases strength by 10% and max health by 5% respectively",
};
