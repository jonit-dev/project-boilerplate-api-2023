import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSpikedClub: Partial<IItem> = {
  key: MacesBlueprint.SpikedClub,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/spiked-club.png",
  textureKey: "spiked-club",
  name: "Spiked-club",
  description: "A simple wooden club with metal spikes.",
  attack: 3,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
