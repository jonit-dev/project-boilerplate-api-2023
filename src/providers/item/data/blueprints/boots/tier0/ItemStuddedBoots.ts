import {
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedBoots: IEquippableLightArmorTier0Blueprint = {
  key: BootsBlueprint.StuddedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/studded-boots.png",
  name: "Studded Boots",
  description: "A boot made with leather and metal studs.",
  defense: 4,
  tier: 0,
  weight: 0.7,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 37,
  equippedBuff: {
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
  equippedBuffDescription: "Increases resistance by 2%",
};
