import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightLifePotion: Partial<IItem> = {
  key: PotionsBlueprint.LightLifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/light-life-potion.png",
  textureKey: "light-life-potion",
  name: "Light Life Potion",
  description: "A small flask containing an elixir of endurance.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
