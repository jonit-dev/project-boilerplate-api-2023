import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenSword: Partial<IItem> = {
  key: SwordsBlueprint.WoodenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/wooden-sword.png",
  name: "Training Sword",
  description:
    "A weapon with a long, pointed blade used for thrusting and cutting, often with a handle and guard made of wood.",
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 1,
  defense: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 40,
};
