import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGuardianAxe: IEquippableMeleeTier9WeaponBlueprint = {
  key: AxesBlueprint.GuardianAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/guardian-axe.png",
  name: "Guardian Axe",
  description:
    "Forged with protective spells woven into the very metal, this axe serves as both a weapon and a shield, bolstering the defense of allies in proximity.",
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 68,
  defense: 65,
  tier: 9,
  rangeType: EntityAttackType.Melee,
  basePrice: 92,
};
