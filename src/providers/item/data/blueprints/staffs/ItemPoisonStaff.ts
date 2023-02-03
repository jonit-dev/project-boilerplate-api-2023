import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.PoisonStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/poison-staff.png",
  name: "Poison Staff",
  description:
    "A staff imbued with powerful toxins and venom, capable of releasing deadly poison on contact and causing serious injury or death.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 10,
  rangeType: EntityAttackType.Ranged,
  basePrice: 85,
  maxRange: 5,
};
