import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightAntidote: Partial<IItem> = {
  key: PotionsBlueprint.LightAntidote,
  type: ItemType.Consumable,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "potions/light-antidote.png",
  name: "Light Antidote",
  description: "A small flask containing an elixir of antidote.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Inventory],
  sellPrice: 15,
};
