import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalHelmet: IEquippableLightArmorTier4Blueprint = {
  key: HelmetsBlueprint.RoyalHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/royal-helmet.png",
  name: "Royal Helmet",
  description: "The Royal Helmet are made with fine and high quality materials.",
  defense: 17,
  tier: 4,
  weight: 1.7,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 77,
  equippedBuff: {
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
  equippedBuffDescription: "Increases strength by 10%",
};
