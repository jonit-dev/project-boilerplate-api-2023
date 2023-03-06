import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronArrow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.IronArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/iron-arrow.png",
  name: "Iron Arrow",
  description: "Description",
  weight: 0.06,
  maxStackSize: 100,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 3,
  attack: 5,
  rangeType: EntityAttackType.Melee,
};
