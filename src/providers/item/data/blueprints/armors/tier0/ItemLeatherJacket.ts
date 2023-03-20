import { IEquippableArmorTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLeatherJacket: IEquippableArmorTier0Blueprint = {
  key: ArmorsBlueprint.LeatherJacket,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/leather-jacket.png",

  name: "Leather Jacket",
  description: "A jacket made of treated leather.",
  defense: 5,
  tier: 0,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 45,
};
