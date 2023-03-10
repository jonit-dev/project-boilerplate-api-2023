import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemShuriken: Partial<IItem> = {
  key: RangedWeaponsBlueprint.Shuriken,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  maxRange: 7,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/shuriken-qty-1.png",
  name: "Shuriken",
  description: "A weapon in the form of a star with projecting blades",
  attack: 12,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxStackSize: 50,
  basePrice: 5,
  canSell: false,
};
