import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedShield: IEquippableArmorTier0Blueprint = {
  key: ShieldsBlueprint.StuddedShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/studded-shield.png",
  name: "Studded Shield",
  description: "A wooden shield covered in leather and metal studs.",
  defense: 8,
  tier: 0,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 41,
};
