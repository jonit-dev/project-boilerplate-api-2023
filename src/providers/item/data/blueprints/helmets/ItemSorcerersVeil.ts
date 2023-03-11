import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSorcerersVeil: Partial<IItem> = {
  key: HelmetsBlueprint.SorcerersVeil,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/sorcerers-veil.png",
  name: "Sorcerer's Veil",
  description:
    "The Sorcerer's Veil is a dark and foreboding headpiece that is steeped in ancient magic and occult lore.",
  weight: 1,
  defense: 12,
};
