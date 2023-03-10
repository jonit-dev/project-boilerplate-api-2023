import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenArrow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.GoldenArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/golden-arrow.png",
  name: "Golden Arrow",
  description: "An arrow made of pure gold that deals extra damage to enemies weak to gold.",
  attack: 20,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 50,
  basePrice: 3,
};
