import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableTwoHandedTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SpearsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRustedDoubleVoulge: IEquippableTwoHandedTier5WeaponBlueprint = {
  key: SpearsBlueprint.RustedDoubleVoulge,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/rusted-double-voulge.png",
  name: "Rusted Double Voulge",
  description:
    "The Rusted Double Voulge is a two-handed polearm with a long handle and two long blades that have been heavily corroded and rusted over time. Despite its weathered appearance, the weapon is still surprisingly sharp, able to tear through flesh and bone with jagged serrations along the blades.",
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 88,
  defense: 40,
  tier: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 44,
  isTwoHanded: true,
};
