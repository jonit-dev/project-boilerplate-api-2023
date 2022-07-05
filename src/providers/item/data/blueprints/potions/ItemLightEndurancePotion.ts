import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemLightEndurancePotion: Partial<IItem> = {
  key: "light-endurance-potion",
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/light-endurance-potion.png",
  textureKey: "light-endurance-potion",
  name: "Light Endurance Potion",
  description: "A small flask containing an elixir of endurance.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};