import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIroncladArmor: IEquippableArmorTier2Blueprint = {
  key: ArmorsBlueprint.IroncladArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/ironclad-armor.png",
  name: "Ironclad Armor",
  description:
    "Crafted from thick and heavy plates of iron or steel, Ironclad armor is difficult to move in and requires a great deal of strength and endurance to wear.",
  defense: 18,
  tier: 2,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 120,
};
