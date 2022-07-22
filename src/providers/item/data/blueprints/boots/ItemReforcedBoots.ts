import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemReforcedBoots: Partial<IItem> = {
  key: BootsBlueprint.ReforcedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/reforced-boots.png",
  textureKey: "reforced-boots",
  name: "Reforced Boots",
  description: "A boots made with reinforced leather.",
  defense: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
};
