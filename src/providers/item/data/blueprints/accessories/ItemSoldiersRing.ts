import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSoldiersRing: Partial<IItem> = {
  key: AccessoriesBlueprint.SoldiersRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/soldiers-ring.png",
  name: "Soldiers Ring",
  description: "A rugged iron ring, crafted by a talented dwarf artisan for use on the battlefield.",
  attack: 5,
  defense: 3,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 30,
};
