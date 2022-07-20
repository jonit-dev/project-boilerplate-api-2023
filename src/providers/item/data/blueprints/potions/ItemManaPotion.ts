import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemManaPotion: Partial<IItem> = {
  key: PotionsBlueprint.ManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/mana-potion.png",
  textureKey: "mana-potion",
  name: "mana-potion",
  description: "A flask containing blue liquid of a mana potion.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
