import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedArmor: IEquippableArmorTier1Blueprint = {
  key: ArmorsBlueprint.StuddedArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/studded-armor.png",

  name: "Studded Armor",
  description: "A basic leather armor with metal studs.",
  defense: 12,
  tier: 1,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 73,
};
