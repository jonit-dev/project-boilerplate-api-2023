import { IEquippableArmorTier5Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBloodfireArmor: IEquippableArmorTier5Blueprint = {
  key: ArmorsBlueprint.BloodfireArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/bloodfire-armor.png",
  name: "Bloodfire Armor",
  description:
    "This powerful armor is said to be forged from the flames of dragons and imbued with the essence of blood magic, granting its wearer enhanced strength and the ability to wield powerful fire-based attacks.",
  defense: 37,
  tier: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 180,
  equippedBuff: [
    {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of max health flowing through your body. (+10% MaxHealth)",
          deactivation: "You feel the power of max health leaving your body. (-10% MaxHealth)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: 10,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of resistance flowing through your body. (+10% resistance)",
          deactivation: "You feel the power of resistance leaving your body. (-10% resistance)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases max health by 10% and resistance by 10% respectively",
};
