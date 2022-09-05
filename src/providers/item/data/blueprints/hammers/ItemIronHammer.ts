import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { HammersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronHammer: Partial<IItem> = {
  key: HammersBlueprint.IronHammer,
  type: ItemType.Tool,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "hammers/iron-hammer.png",
  textureKey: "iron-hammer",
  name: "Iron Hammer",
  description: "An iron hammer.",
  attack: 3,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
