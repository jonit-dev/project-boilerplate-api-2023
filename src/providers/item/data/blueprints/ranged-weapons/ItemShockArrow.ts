import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemShockArrow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.ShockArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/shock-arrow.png",
  name: "Shock Arrow",
  description: "An arrow infused with electricity that deals heavy damage.",
  attack: 16,
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 2,
};
