import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.FireWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/fire-wand.png",
  name: "Fire Wand",
  description:
    "A wand or staff imbued with the power of flames, capable of generating and controlling intense heat and fire.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
