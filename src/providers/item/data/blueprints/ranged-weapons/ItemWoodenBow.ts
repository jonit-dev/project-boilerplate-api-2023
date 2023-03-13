import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.WoodenBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/wooden-bow.png",
  name: "Training Bow",
  description: "A weapon made of wood used for firing arrows.",
  attack: 1,
  defense: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  requiredAmmoKeys: [RangedWeaponsBlueprint.WoodenArrow],
  isTwoHanded: true,
  basePrice: 40,
  isTraining: true,
};
