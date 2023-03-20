import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTrident: IEquippableTwoHandedTier2WeaponBlueprint = {
  key: SpearsBlueprint.Trident,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/trident.png",
  name: "Trident",
  description:
    "A type of spear with three prongs or points, famously wielded by the sea god Poseidon. It is a formidable weapon that can deliver powerful, multi-directional attacks.",
  weight: 8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 34,
  defense: 22,
  tier: 2,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
