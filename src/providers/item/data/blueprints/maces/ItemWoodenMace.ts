import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenMace: Partial<IItem> = {
  key: MacesBlueprint.WoodenMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/wooden-mace.png",
  name: "wooden-mace",
  description: "A club-like weapon with a heavy head, often spiked or flanged, used for striking in combat.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 1,
  defense: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
