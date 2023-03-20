import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBohemianEarspoon: IEquippableTwoHandedTier2WeaponBlueprint = {
  key: SpearsBlueprint.BohemianEarspoon,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/bohemian-earspoon.png",
  name: "Bohemian Earspoon",
  description:
    "A type of spear with a distinctive crescent-shaped blade, originally used by Czech mercenaries. It is a versatile weapon that can be used for both thrusting and slicing attacks.",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 34,
  defense: 16,
  tier: 2,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
