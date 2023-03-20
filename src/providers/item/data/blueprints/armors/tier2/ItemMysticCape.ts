import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMysticCape: IEquippableArmorTier2Blueprint = {
  key: ArmorsBlueprint.MysticCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/mystic-cape.png",
  name: "Mystic Cape",
  description:
    "The cape is said to be imbued with powerful enchantments that enhance the wearer's magical abilities and provide protection against magical attacks.",
  defense: 20,
  tier: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 100,
};
