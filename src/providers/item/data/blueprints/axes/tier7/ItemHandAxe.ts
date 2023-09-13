import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHandAxe: IEquippableMeleeTier7WeaponBlueprint = {
  key: AxesBlueprint.HandAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hand-axe.png",
  name: "Hand Axe",
  description:
    "Compact yet deadly, this hand-axe is perfect for quick and stealthy attacks, giving its wielder an edge in agility and dexterity.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 54,
  defense: 51,
  tier: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 75,
};
