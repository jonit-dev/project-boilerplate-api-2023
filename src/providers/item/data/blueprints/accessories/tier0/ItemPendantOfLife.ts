import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPendantOfLife: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.PendantOfLife,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/pendand-of-life.png",
  name: "Pendant Of Life",
  description:
    "This enchanted pendant is said to hold the essence of life itself, granting its wearer the ability to restore health and vitality to themselves and others.",
  attack: 2,
  defense: 2,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 5000,
  equippedBuff: {
    type: CharacterBuffType.CharacterAttribute,
    trait: CharacterAttributes.MaxHealth,
    buffPercentage: 2,
    durationType: CharacterBuffDurationType.Permanent,
  },
  equippedBuffDescription: "Increases maxHealth by 2%",
};
