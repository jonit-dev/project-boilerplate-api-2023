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
  description:
    "A staff adorned with sparkling rubies, symbolizing wealth and prosperity. It is also imbued with powerful magical energy.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 11,
  defense: 6,
  rangeType: EntityAttackType.Melee,
  basePrice: 90,
};
