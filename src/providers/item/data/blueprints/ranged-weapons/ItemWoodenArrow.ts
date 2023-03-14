import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenArrow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.WoodenArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/wooden-arrow.png",
  name: "Training Arrow",
  description: "A pointed wooden stick used with a bow to shoot long-range projectiles.",
  attack: 1,
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 0.1,
  isTraining: true,
};