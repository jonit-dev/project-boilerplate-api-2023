import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronArmor: IEquippableArmorTier1Blueprint = {
  key: ArmorsBlueprint.IronArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/iron-armor.png",
  name: "Iron Armor",
  description: "An iron plated armor.",
  defense: 15,
  tier: 1,
  weight: 6,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 81,
};
