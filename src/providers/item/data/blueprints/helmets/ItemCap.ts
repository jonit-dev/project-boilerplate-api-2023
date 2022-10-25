import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCap: Partial<IItem> = {
  key: HelmetsBlueprint.Cap,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/cap.png",
  name: "Cap",
  description: "Simple cap.",
  defense: 2,
  weight: 0.3,
  allowedEquipSlotType: [ItemSlotType.Head],
};
