import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAirWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.AirWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/air-wand.png",
  name: "Air Wand",
  description: "A type of wand or staff that harnesses the power of air or wind",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 2,
  rangeType: EntityAttackType.Ranged,
  basePrice: 70,
  maxRange: 10,
};
