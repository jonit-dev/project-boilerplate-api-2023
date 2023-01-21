import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMace: Partial<IItem> = {
  key: MacesBlueprint.Mace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/mace.png",
  name: "Mace",
  description: "A simple iron headed mace.",
  attack: 8,
  defense: 3,
  weight: 2.7,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 69,
};
