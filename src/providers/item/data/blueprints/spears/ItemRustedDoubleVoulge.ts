import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRustedDoubleVoulge: IEquippableWeaponBlueprint = {
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
  attack: 12,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 44,
};
