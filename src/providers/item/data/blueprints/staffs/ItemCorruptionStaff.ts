import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionStaff: Partial<IItem> = {
  key: StaffsBlueprint.CorruptionStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "staffs/corruption-staff.png",
  textureKey: "corruption-staff",
  name: "Corruption Staff",
  description: "A shriveled staff of corruption.",
  attack: 3,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
