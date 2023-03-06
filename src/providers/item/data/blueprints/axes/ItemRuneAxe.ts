import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRuneAxe: Partial<IItem> = {
  key: AxesBlueprint.RuneAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/rune-axe.png",
  name: "Rune Axe",
  description: "An axe with rune ancient inscriptions.",
  attack: 17,
  defense: 4,
  weight: 2.1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 62,
};
