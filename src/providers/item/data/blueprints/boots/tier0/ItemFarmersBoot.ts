import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CraftingSkill,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFarmersBoot: IEquippableLightArmorTier0Blueprint = {
  key: BootsBlueprint.FarmersBoot,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/farmers-boot.png",
  name: "Farmers Boot",
  description:
    "The boots also provide some protection against environmental hazards such as mud or shallow water, making them a practical choice for farmers or other characters who spend a lot of time outdoors.",
  weight: 1,
  defense: 3,
  tier: 0,
  allowedEquipSlotType: [ItemSlotType.Feet],
  equippedBuff: [
    {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: 1,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of resistance flowing through your body. (+1% resistance)",
          deactivation: "You feel the power of resistance leaving your body. (-1% resistance)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: CraftingSkill.Blacksmithing,
      buffPercentage: 2,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of blacksmithing flowing through your body. (+2% blacksmithing)",
          deactivation: "You feel the power of blacksmithing leaving your body. (-2% blacksmithing)",
        },
      },
    },
    {
      type: CharacterBuffType.Skill,
      trait: CraftingSkill.Lumberjacking,
      buffPercentage: 2,
      durationType: CharacterBuffDurationType.Permanent,
      options: {
        messages: {
          activation: "You feel the power of lumberjacking flowing through your body. (+2% lumberjacking)",
          deactivation: "You feel the power of lumberjacking leaving your body. (-2% lumberjacking)",
        },
      },
    },
  ],
  equippedBuffDescription: "Increases resistance by 1% , blacksmithing by 2% and lumberjacking by 2% respectively",
};
