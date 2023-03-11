import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFalconsRing: Partial<IItem> = {
  key: AccessoriesBlueprint.FalconsRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/falcons-ring.png",
  name: "Falcon's Ring",
  description:
    "Striking and ornate piece of jewelry that is often worn by knights and other chivalrous warriors who embody the virtues of bravery, honor, and loyalty.",
  weight: 1,
  attack: 8,
  defense: 6,
};
