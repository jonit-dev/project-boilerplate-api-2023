import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWand: Partial<IMagicStaff> = {
  key: StaffsBlueprint.Wand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/wand.png",
  name: "Wand",
  description:
    "A powerful magic wand crafted by the dark lord Sauron himself, imbued with malevolent energy and deadly magical power.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
