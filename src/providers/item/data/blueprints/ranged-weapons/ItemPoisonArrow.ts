import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonArrow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.PoisonArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/poison-arrow.png",
  name: "Poison Arrow",
  description: "An arrow coated with poison.",
  attack: 18,
  weight: 0.025,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 1.5,
};
