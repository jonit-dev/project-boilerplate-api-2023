import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRubyStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.RubyStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/ruby-staff.png",
  name: "Ruby Staff",
  description: "A staff adorned with rubies, often used as a symbol of wealth or power",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 9,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 90,
};
