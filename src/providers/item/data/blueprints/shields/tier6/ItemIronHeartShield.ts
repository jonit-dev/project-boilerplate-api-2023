import { IEquippableArmorTier6Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronHeartShield: IEquippableArmorTier6Blueprint = {
  key: ShieldsBlueprint.IronHeartShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/iron-heart-shield.png",
  name: "Iron Heart Shield",
  description:
    "Forged with a core of pure iron, this shield provides additional protection against blunt force attacks. A must for battling hammer-wielding foes.",
  weight: 2,
  defense: 48,
  tier: 6,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
