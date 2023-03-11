import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBloodfireBoot: Partial<IItem> = {
  key: BootsBlueprint.BloodfireBoot,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/bloodfire-boot.png",
  name: "Bloodfire Boot",
  description:
    "The Bloodfire Boots are often associated with the power and intensity of fire magic, as well as the dark and mysterious nature of blood magic.",
  defense: 8,
  weight: 1,
  basePrice: 90,
  allowedEquipSlotType: [ItemSlotType.Feet],
};
