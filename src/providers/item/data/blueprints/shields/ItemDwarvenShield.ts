import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDwarvenShield: Partial<IItem> = {
  key: ShieldsBlueprint.DwarvenShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/dwarven-shield.png",
  name: "Dwarven Shield",
  description:
    "The Dwarven Shield is a sturdy and resilient piece of defensive equipment that is often used by dwarves and other stout-hearted warriors who value strength and durability in battle.",
  weight: 1,
  defense: 17,
};
