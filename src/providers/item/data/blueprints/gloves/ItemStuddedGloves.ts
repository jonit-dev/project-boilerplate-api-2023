import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedGloves: Partial<IItem> = {
  key: GlovesBlueprint.StuddedGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/studded-gloves.png",
  textureKey: "studded-gloves",
  name: "studded-gloves",
  description: "A pair of leather gloves with metal studs.",
  defense: 4,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
