import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemJacket: IEquippableArmorTier0Blueprint = {
  key: ArmorsBlueprint.Jacket,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/jacket.png",
  name: "Jacket",
  description: "You see a jacket.",
  defense: 2,
  tier: 0,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 0,
};
