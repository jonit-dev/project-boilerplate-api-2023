import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableArmorTier5Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMithrilArmor: IEquippableArmorTier5Blueprint = {
  key: ArmorsBlueprint.MithrilArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/mithril-armor.png",
  name: "Mithril armor",
  description:
    "A legendary armor forged from a rare, incredibly strong metal that is light, durable, and highly sought after.",
  defense: 37,
  tier: 5,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 160,
  equippedBuff: [
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
  ],
  equippedBuffDescription: "Increases resistance by 10% and max health by 10% respectively",
};
