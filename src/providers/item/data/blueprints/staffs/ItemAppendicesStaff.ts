import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAppendicesStaff: Partial<IItem> = {
  key: StaffsBlueprint.AppendicesStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "staffs/appendice's-staff.png",
  textureKey: "appendice's-staff",
  name: "Appendice's Staff",
  description: "A simple wooden staff used by those learning the basics of magic.",
  attack: 1,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
