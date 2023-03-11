import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMysticVeil: Partial<IItem> = {
  key: HelmetsBlueprint.MysticVeil,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/mystic-veil.png",
  name: "Mystic Veil",
  description: "The Mystic Veil is a mysterious and enchanting headpiece that is shrouded in magic and intrigue.",
  weight: 1,
  defense: 10,
  allowedEquipSlotType: [ItemSlotType.Head],
};
