import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalBoots: IEquippableLightArmorTier3Blueprint = {
  key: BootsBlueprint.RoyalBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/royal-boots.png",
  name: "Royal Boots",
  description: "The Royal Boots are made with fine and high quality materials.",
  defense: 13,
  tier: 3,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 73,
  equippedBuff: {
    type: CharacterBuffType.CharacterAttribute,
    trait: CharacterAttributes.Speed,
    buffPercentage: 5,
    durationType: CharacterBuffDurationType.Permanent,
    options: {
      messages: {
        activation: "You feel the power of speed and quickness flowing through your body. (+5 speed)",
        deactivation: "You feel the power of speed and quickness leaving your body. (-5% speed)",
      },
    },
  },
  equippedBuffDescription: "Increases speed by 5%",
};
