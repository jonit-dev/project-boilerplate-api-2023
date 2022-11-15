import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFrostDoubleAxe: Partial<IItem> = {
  key: AxesBlueprint.FrostDoubleAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/frost-double-axe.png",

  name: "Frost Double Axe",
  description: "A large master-crafted weapon with a frosted blade.",
  attack: 14,
  defense: 5,
  weight: 4,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
