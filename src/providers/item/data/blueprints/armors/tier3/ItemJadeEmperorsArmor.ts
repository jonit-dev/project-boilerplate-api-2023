import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemJadeEmperorsArmor: IEquippableArmorTier3Blueprint = {
  key: ArmorsBlueprint.JadeEmperorsArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/jade-emperors-armor.png",
  name: "Jade Emperor's Armor",
  description:
    "Crafted from rare and precious materials such as jade or gold, Jade Emperor's Armor is adorned with intricate designs.",
  defense: 24,
  tier: 3,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 120,
};
